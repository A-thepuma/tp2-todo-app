import { useAdaptiveColors } from "@/lib/hooks/use-adaptive-colors";
import type { FC } from "react";
import { Text, View } from "react-native";

type Props = {
  /**
   * Les messages d'erreurs à afficher
   */
  errors: string[]
}

/**
 * Affichage des erreurs sous un champ de formulaire
 * @returns 
 */
export const FieldErrors: FC<Props> = function ({ errors }) {
  const colors = useAdaptiveColors();
  return <View style={{marginTop: 4}}>
    {errors.map((error, index) => 
      <Text key={index} style={{fontSize: 12, fontWeight: "600", color: '#dc2626'}}>  
        {error}
      </Text>)}
  </View>;
};