import { useEffect, type FC } from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, { withSpring, useSharedValue, withTiming, Easing, useAnimatedStyle, interpolateColor } from "react-native-reanimated";
import { useAdaptiveColors } from "@/lib/hooks/use-adaptive-colors";
import { Feather } from "@expo/vector-icons";

type Props = {
  /**
   * Si la case est cochée ou non
   */
  checked: boolean,

  /**
   * Callback appelé lorsque la case est cochée ou décochée
   * @param checked Indique l'état de la case à cocher
   * @returns 
   */
  onValueChange?: (checked: boolean) => void,

  /**
   * Définit la taille de la checkbox. 
   * @default 14
   */
  size?: number,

  /**
   * Desactive ou non la case à cochée. Utile lors d'un chargement.
   * @default false
   */
  disabled?: boolean
}

/**
 * Case à cocher
 */
export const Checkbox: FC<Props> = function ({ checked, onValueChange, size = 14, disabled = false }) {
  const colors = useAdaptiveColors();

  // Valeurs de base des animations
  const checkedStatus = useSharedValue<boolean>(checked);
  const bgColor = useSharedValue(checked ? 1 : 0);

  // Déclenche l'animation du fond de la case à cocher lorsque "checked" change de valeur
  useEffect(() => {
    checkedStatus.value = checked;
    bgColor.value = withTiming(checked ? 1 : 0, { duration: 200, easing: Easing.inOut(Easing.quad) });
  }, [checked]);

  // Styles animés de l'icône de la case à cocher
  const iconAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(checkedStatus.value ? 1 : 0.5, {
          stiffness: 300
        })
      }
    ],
    opacity: withTiming(checkedStatus.value ? 1 : 0, {
      easing: Easing.inOut(Easing.quad),
      duration: 200
    }),
  }));

  // Styles animés du fond de la case à cocher
  const backgroundAnimatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        bgColor.value,
        [0, 1],
        ['transparent', colors.checkboxFill]
      ),
      borderColor: interpolateColor(
        bgColor.value,
        [0, 1],
        [colors.checkboxBorder, colors.checkboxFill]
      )
    }
  }, [colors]);

  const handlePress = () => {
    onValueChange?.(!checked);
  }

  return <Pressable
    accessibilityRole="checkbox"
    disabled={disabled}
    accessibilityState={{ checked }}
    onPress={handlePress}
    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
  >
    <Animated.View style={[
      styles.checkbox,
      { borderRadius: size * 0.5 },
      backgroundAnimatedStyles
    ]}>
      <Animated.View
        style={iconAnimatedStyles}
      >
        <Feather name="check" color={colors.checkboxCheckIcon} size={size + 4} weight="bold" />
      </Animated.View>
    </Animated.View>
  </Pressable>;
};

const styles = StyleSheet.create({
  checkbox: {
    borderStyle: "solid",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  }
});
