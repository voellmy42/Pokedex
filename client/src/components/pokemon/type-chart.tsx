import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { typeTranslations, getTypeBackgroundClass, getTypeTextClass } from "@/lib/pokemon";

// Import effectiveness data from battle.ts
import { typeEffectiveness } from "@/lib/battle";

type TypeEffectiveness = {
  strong: string[];
  weak: string[];
  immune: string[];
};

export default function TypeChart() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const getTypeEffectiveness = (type: string): TypeEffectiveness => {
    const effectiveness: TypeEffectiveness = {
      strong: [],
      weak: [],
      immune: []
    };

    Object.entries(typeEffectiveness[type] || {}).forEach(([defenderType, multiplier]) => {
      if (multiplier === 2) {
        effectiveness.strong.push(defenderType);
      } else if (multiplier === 0.5) {
        effectiveness.weak.push(defenderType);
      } else if (multiplier === 0) {
        effectiveness.immune.push(defenderType);
      }
    });

    return effectiveness;
  };

  const allTypes = Object.keys(typeTranslations);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">Typ-Effektivität</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Type Selection */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {allTypes.map((type) => (
              <Badge
                key={type}
                className={`
                  ${getTypeBackgroundClass(type)} 
                  ${getTypeTextClass(type)}
                  cursor-pointer
                  ${selectedType === type ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
                onClick={() => setSelectedType(type === selectedType ? null : type)}
              >
                {typeTranslations[type]}
              </Badge>
            ))}
          </div>

          {/* Effectiveness Display */}
          {selectedType && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">
                {typeTranslations[selectedType]} Typ-Analyse:
              </h3>
              
              {/* Super Effective */}
              <div className="space-y-2">
                <h4 className="font-medium text-emerald-700">Sehr effektiv gegen (2x):</h4>
                <div className="flex flex-wrap gap-2">
                  {getTypeEffectiveness(selectedType).strong.map(type => (
                    <Badge
                      key={type}
                      className={`${getTypeBackgroundClass(type)} ${getTypeTextClass(type)}`}
                    >
                      {typeTranslations[type]}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Not Very Effective */}
              <div className="space-y-2">
                <h4 className="font-medium text-amber-700">Nicht sehr effektiv gegen (0.5x):</h4>
                <div className="flex flex-wrap gap-2">
                  {getTypeEffectiveness(selectedType).weak.map(type => (
                    <Badge
                      key={type}
                      className={`${getTypeBackgroundClass(type)} ${getTypeTextClass(type)}`}
                    >
                      {typeTranslations[type]}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* No Effect */}
              <div className="space-y-2">
                <h4 className="font-medium text-red-700">Keine Wirkung gegen (0x):</h4>
                <div className="flex flex-wrap gap-2">
                  {getTypeEffectiveness(selectedType).immune.map(type => (
                    <Badge
                      key={type}
                      className={`${getTypeBackgroundClass(type)} ${getTypeTextClass(type)}`}
                    >
                      {typeTranslations[type]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
