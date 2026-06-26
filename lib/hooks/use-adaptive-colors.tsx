import { useColorScheme } from "react-native";
import { DarkColors, LightColors } from "@/lib/colors/colors";

export function useAdaptiveColors() {
  const colorScheme = useColorScheme();

  return colorScheme === "dark" ? DarkColors : LightColors;
}