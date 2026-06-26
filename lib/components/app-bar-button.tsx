import { ComponentRef, forwardRef, type ReactNode } from "react";
import { ColorSchemeName, Pressable, StyleSheet, useColorScheme, ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

type Props = {
  /**
   * Le contenu du bouton à afficher
   */
  children?: ReactNode,

  /**
   * La taille du bouton
   */
  size?: 'lg' | 'md',
  
  /**
   * Callback appelé lors de la pression du bouton
   */
  onPress?: () => void,
};

/**
 * Boutton affiché dans la barre en bas de l'écran de la page d'accueil
 */
const AppBarButton = forwardRef<ComponentRef<typeof Pressable>, Props>(function ({ children, size = 'md', ...rest }, ref) {
  const colorScheme = useColorScheme()
  const styles = makeStyles(colorScheme);
  const pressed = useSharedValue<boolean>(false);

  const viewStyle: ViewStyle = {
    paddingVertical: size === 'md' ? 8 : 12,
    paddingHorizontal: size === 'md' ? 8 : 24,
  };

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(pressed.value ? 0.6 : 1, {
      easing: Easing.inOut(Easing.quad)
    }),
    transform: [
      { scale: withSpring(pressed.value ? 0.9 : 1) }
    ]
  }));

  return <Pressable
    ref={ref}
    {...rest}
    onPress={() => {
      rest?.onPress?.();
    }}
    onPressIn={() => pressed.value = true}
    onPressOut={() => pressed.value = false}
  >
    <Animated.View style={[
      styles.button,
      viewStyle,
      animatedStyles
    ]}>
      {children}
    </Animated.View>
  </Pressable>
});

AppBarButton.displayName = "AppBarButton";
export { AppBarButton };

const makeStyles = (colorScheme: ColorSchemeName) => StyleSheet.create({
  button: {
    backgroundColor: colorScheme === "light" ? '#e5e5ea' : "#2c2c2e",
    borderRadius: 32,
  }
})
