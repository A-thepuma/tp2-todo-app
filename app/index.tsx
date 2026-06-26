import { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Modal, Button, Text, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TaskItem } from "@/lib/components/task-item";
import { AppBarButton } from "@/lib/components/app-bar-button";
import { TextField } from "@/lib/components/text-field";
import { MultilineTextField } from "@/lib/components/multiline-text-field";

// Types et Services
import type { TaskItemData } from "@/lib/types/taskItemData";
import { getTasks, addTask, updateTaskStatus, updateTask } from "@/lib/services/database";

export default function Index() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItemData[]>([]);

  const [hideCompleted, setHideCompleted] = useState(false);

  // États pour l'Ajout
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  // États pour la Modification si on appui longtemps
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItemData | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Chargement des données depuis SQLite
  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des tâches :", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  // Filtrage dynamique des tâches avant affichage
  const displayedTasks = hideCompleted
    ? tasks.filter(task => !task.completed)
    : tasks;

  // Gestion des actions
  const handleToggleTask = async (id: string, completed: boolean) => {
    await updateTaskStatus(id, completed);
    loadTasks();
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === "") {
      setError("Le titre ne peut pas être vide");
      return;
    }
    const newId = String(Date.now());
    const todayStr = new Date().toISOString().split('T')[0];

    await addTask(newId, newTaskTitle.trim(), todayStr, newTaskDescription.trim());

    setNewTaskTitle("");
    setNewTaskDescription("");
    setError(undefined);
    setIsModalVisible(false);
    loadTasks();
  };

  const handleSaveEdit = async () => {
    if (!editingTask || editTitle.trim() === "") return;
    await updateTask(editingTask.id, editTitle.trim(), editDescription.trim(), editingTask.date);
    setIsEditModalVisible(false);
    setEditingTask(null);
    loadTasks();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <FlatList
          data={displayedTasks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onChange={(completed: boolean) => handleToggleTask(item.id, completed)}
              onLongPress={() => {
                setEditingTask(item);
                setEditTitle(item.title);
                setEditDescription(item.description || "");
                setIsEditModalVisible(true);
              }}
            />
          )}
        />

      </View>

      {/* Barre de navigation */}
      <View style={styles.bottomBar}>
        <AppBarButton onPress={() => router.push("/settings")}>
          <Feather name="settings" size={18} />
        </AppBarButton>

        <AppBarButton size="lg" onPress={() => setIsModalVisible(true)}>
          <Feather name="plus" size={22} />
        </AppBarButton>

        {/* Bouton oeil, changement de couleur si caché ou pas */}
        <AppBarButton onPress={() => setHideCompleted(!hideCompleted)}>
          <Feather
            name={hideCompleted ? "eye-off" : "eye"}
            size={18}
            color={hideCompleted ? "#ff4757" : "#000"}
          />
        </AppBarButton>
      </View>

      {/* Modal d'ajout de tache */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <Pressable style={styles.modalOverlay} onPress={() => {
          setIsModalVisible(false);
          setNewTaskDescription("");
          setNewTaskTitle("");
        }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: '100%' }}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>Nouvelle tâche</Text>

              <TextField
                placeholder="Faire les courses..."
                value={newTaskTitle}
                onChangeText={(val: string) => {
                  setNewTaskTitle(val);
                  if (error) setError(undefined);
                }}
                errors={error ? [error] : undefined}
              />

              <MultilineTextField
                placeholder="Description (optionnelle)..."
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
              />

              <View style={{ height: 12 }} />
              <Button title="Ajouter" onPress={handleAddTask} />
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* Modal de modification d'une täche */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsEditModalVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: '100%' }}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.handleBar} />
              <Text style={styles.modalTitle}>Modifier la tâche</Text>

              <TextField
                placeholder="Titre"
                value={editTitle}
                onChangeText={setEditTitle}
              />

              <MultilineTextField
                placeholder="Description (optionnelle)..."
                value={editDescription}
                onChangeText={setEditDescription}
              />

              <View style={{ height: 12 }} />
              <Button title="Sauvegarder" onPress={handleSaveEdit} />
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9F9F9" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  list: { paddingBottom: 40 },
  separator: { height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: "#EAEAEA", marginVertical: 12 },
  card: { backgroundColor: "#EAEAEA", borderRadius: 16, overflow: "hidden", paddingVertical: 4 },
  bottomBar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, paddingHorizontal: 24, backgroundColor: "#F9F9F9", borderTopWidth: 1, borderColor: "#EAEAEA" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  handleBar: { width: 40, height: 5, backgroundColor: "#ccc", borderRadius: 3, alignSelf: "center", marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#222" },
});