import { DarkColors, LightColors } from "@/lib/colors/colors";
import { useEffect, useMemo, type FC } from "react";
import { ColorSchemeName, StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

type Props = {
  /**
   * Le titre de la tâche
   */
  title: string,

  /**
   * Si définit à true, le titre sera rayé.
   */
  completed: boolean
}

/**
 * Titre d'une tâche sur la page d'accueil
 */
export const TodoTitle: FC<Props> = function ({ title, completed }) {
  const colorScheme = useColorScheme();
  const styles = useMemo(
    () => makeStyles(colorScheme),
    [colorScheme]
  );

  const lineScale = useSharedValue(completed ? 1 : 0);
  useEffect(() => {
    lineScale.value = withSpring(completed ? 1 : 0, {
      duration: 200,
      dampingRatio: 0.8
    })
  }, [completed]);

  return <View style={styles.container}>
    {completed && <Animated.View style={[
      styles.lineThrough,
      {
        transform: [
          { scaleX: lineScale }
        ]
      }
    ]} />}

    <Text style={[
      styles.title,
    ]}>
      {title}
    </Text>
  </View>
    ;
};

const makeStyles = (colorScheme: ColorSchemeName) => {
  const colors = colorScheme === "dark" 
    ? DarkColors
    : LightColors;
  
  return StyleSheet.create({
    container: {
      position: "relative"
    },
    lineThrough: {
      position: "absolute",
      height: 2,
      borderRadius: 2,
      backgroundColor: "#888",
      top: "50%",
      left: -2,
      right: -2,
      marginTop: -1,
      transformOrigin: "left",
    },
    title: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text
    },
  });
}