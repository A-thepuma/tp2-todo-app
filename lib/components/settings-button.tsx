import { ComponentRef, forwardRef, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useAdaptiveColors } from "@/lib/hooks/use-adaptive-colors";

type Props = {
  /**
   * La couleur du bouton
   */
  color?: string,

  /**
   * Le texte qui sera affiché pour le bouton
   */
  label: string,

  /**
   * Un icon optionel. Reçoit la couleur en paramètre.
   */
  icon?: (color: string) => ReactNode,

  /**
   * Callback appelé lors d'une pression sur le bouton
   */
  onPress?: () => void,
};

/**
 * Bouton de l'écran de paramètres
 */
const SettingsButton = forwardRef<ComponentRef<typeof Pressable>, Props>(function ({ color, icon, label, ...rest }, ref) {
  const colors = useAdaptiveColors();
  if (!color)
    color = colors.text;

  const pressed = useSharedValue<boolean>(false);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(pressed.value ? 0.6 : 1, {
      easing: Easing.inOut(Easing.quad)
    }),
    transform: [
      { scale: withSpring(pressed.value ? 0.985 : 1) }
    ]
  }));

  return <Pressable
    ref={ref}
    {...rest}
    onPress={() => rest?.onPress?.()}
    onPressIn={() => pressed.value = true}
    onPressOut={() => pressed.value = false}
  >
    <Animated.View style={[styles.button, animatedStyles]}>
      <View style={styles.buttonChildrenWrapper}>
        {icon && icon(color)}
        <Text style={[styles.buttonLabel, { color }]}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={16} color={color} weight="bold" />
    </Animated.View>
  </Pressable>
});

SettingsButton.displayName = "SettingsButton";
export { SettingsButton };

const styles = StyleSheet.create({
  button: {
    padding: 16,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "space-between"
  },
  buttonChildrenWrapper: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  buttonLabel: {
    fontWeight: "600"
  }
})