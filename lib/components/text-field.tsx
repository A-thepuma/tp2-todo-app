import { ColorSchemeName, StyleSheet, TextInput, useColorScheme, View } from "react-native"
import { DarkColors, LightColors } from "@/lib/colors/colors";
import { FC, useMemo } from "react";
import { useAdaptiveColors } from "../hooks/use-adaptive-colors";
import { FieldErrors } from "./field-errors";

export type InputProps = {
  /**
   * Indique si le champ est désactivé ou non
   */
  disabled?: boolean,

  /**
   * La valeur contenue dans le champ
   */
  value: string,

  /**
   * Callback appelé lors du changement de la valeur du champ
   * @param value 
   * @returns 
   */
  onChangeText: (value: string) => void,

  /**
   * Les messages d'erreurs qui seront affichés sous le champ
   */
  errors?: string[],

  /**
   * Le placeholder du champ
   */
  placeholder?: string,
}

/**
 * Un champ basique sur une ligne
 */
export const TextField: FC<InputProps> = function({disabled, value, onChangeText, errors, placeholder}) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => buildInputStyles(colorScheme), [colorScheme]);
  const colors = useAdaptiveColors();

  return <View style={styles.inputContainer}>
    <TextInput
      style={styles.inputField}
      placeholder={placeholder}
      editable={!disabled}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={colors.placeholderText}
    />
    {errors && <FieldErrors errors={errors} />}
  </View>
}

export function buildInputStyles(colorScheme: ColorSchemeName) {
  const colors = colorScheme === 'dark' ? DarkColors : LightColors;
  return StyleSheet.create({
    inputField: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      fontSize: 16,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
      color: colors.text
    },
    inputContainer: {
      marginVertical: 8
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: 400,
      color: colors.text,
    },
  })
}