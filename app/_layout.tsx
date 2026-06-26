import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Pressable, ActivityIndicator, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { initDatabase } from "../lib/services/database";

export default function RootLayout() {

  const router = useRouter();
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => {
        console.log("Base de données initialisée !");
        setIsDbReady(true);
      })
      .catch((error) => {
        console.error("Erreur lors de l'initialisation de la BDD :", error);
      });
  }, []);

  // écran d'attente si la BDD n'est pas prête
  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="settings"
        options={{
          title: "Paramètres",
          animation: "slide_from_left",
          headerBackVisible: false,
          headerRight: () => (
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                padding: 8,
              })}
            >
              <Feather name="chevron-right" size={24} color="#000" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}