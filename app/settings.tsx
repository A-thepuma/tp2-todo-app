import { View, StyleSheet, Text, Alert } from "react-native";
import { SettingsButton } from "@/lib/components/settings-button";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBarButton } from "@/lib/components/app-bar-button";
import { useRouter } from "expo-router";

// Gestion de la bdd
import { resetDatabase, insertDummyTasks } from "@/lib/services/database";

export default function SettingsScreen() {
    const router = useRouter();

    // Insertion des données de test - bouton
    const handleInsertDummy = async () => { 
        try {
            await insertDummyTasks();
            Alert.alert("Succès", "Données de test insérées avec succès !");
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Impossible d'insérer les données.");
        }
    };

    // Vider la base de données avec confirmation au cas où
    const handleClearDatabase = () => {
        Alert.alert(
            "ATTENTION",
            "Voulez-vous vraiment vider toutes vos tâches ?",
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Vider", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await resetDatabase();
                            Alert.alert("Succès", "La base de données a été vidée.");
                        } catch (error) {
                            console.error(error);
                            Alert.alert("Erreur", "Impossible de vider la base de données.");
                        }
                    } 
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <View style={styles.card}>
                    <SettingsButton
                        label="Insérer des données de test"
                        icon={(color) => <Feather name="database" size={18} color={color} />}
                        onPress={handleInsertDummy}
                    />

                    <SettingsButton
                        label={"Vider la base de données"}
                        icon={(color) => <Feather name="trash" size={16} color={color} />}
                        onPress={handleClearDatabase}
                        color={"red"}
                    />
                </View>

            </View>

            <View style={styles.bottomBar}>
                <AppBarButton onPress={() => {}}>
                    <Feather name="settings" size={18} color="#555" />
                </AppBarButton>

                <AppBarButton size="lg" onPress={() => router.push("/")}>
                    <Feather name="plus" size={22} />
                </AppBarButton>

                <AppBarButton onPress={() => router.push("/")}>
                    <Feather name="eye" size={18} color="#a0a0a0" />
                </AppBarButton>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F9F9F9" },
    container: { flex: 1, padding: 16, paddingTop: 30 },
    card: { backgroundColor: "#EAEAEA", borderRadius: 16, overflow: "hidden", paddingVertical: 4 },
    bottomBar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, paddingHorizontal: 24, backgroundColor: "#F9F9F9", borderTopWidth: 1, borderColor: "#EAEAEA" },
});