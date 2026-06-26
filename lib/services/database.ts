import * as SQLite from 'expo-sqlite';
import type { TaskItemData } from "@/lib/types/taskItemData";

// Ouvre la base de données locale
export const getDB = async () => {
  return await SQLite.openDatabaseAsync('todo_app.db');
};

// Crée la table si elle n'existe pas au démarrage (avec le champ date ajouté)
export const initDatabase = async () => {
  const db = await getDB();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    );
  `);
};

// Récupérer les tâches ordonnées par date croissante
export const getTasks = async (): Promise<TaskItemData[]> => {
  const db = await getDB();
  const rows = await db.getAllAsync<{
    id: string;
    title: string;
    description: string | null;
    date: string;
    completed: number
  }>(
    'SELECT * FROM tasks ORDER BY date ASC;'
  );

  return rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    date: row.date,
    completed: row.completed === 1
  }));
};

// Ajouter une tâche (avec date et description optionnelle)
export const addTask = async (id: string, title: string, date: string, description?: string) => {
  const db = await getDB();
  await db.runAsync(
    'INSERT INTO tasks (id, title, description, date, completed) VALUES (?, ?, ?, ?, 0);',
    [id, title, description || null, date]
  );
};

// Modifier complètement une tâche (titre, description, date) - Utile pour l'appui prolongé
export const updateTask = async (id: string, title: string, description: string, date: string) => {
  const db = await getDB();
  await db.runAsync(
    'UPDATE tasks SET title = ?, description = ?, date = ? WHERE id = ?;',
    [title, description, date, id]
  );
};

// Modifier uniquement le statut (complété ou non)
export const updateTaskStatus = async (id: string, completed: boolean) => {
  const db = await getDB();
  await db.runAsync(
    'UPDATE tasks SET completed = ? WHERE id = ?;',
    [completed ? 1 : 0, id]
  );
};

// Bouton Vider la base de données
export const resetDatabase = async () => {
  const db = await getDB();
  await db.execAsync('DELETE FROM tasks;');
};

// Bouton Insérer des données de test
export const insertDummyTasks = async () => {
  const db = await getDB();

  await db.runAsync("INSERT INTO tasks (id, title, description, date, completed) VALUES ('test-1', 'Acheter le café', 'Prendre du grain Arabica', '2026-06-26', 0);");
  await db.runAsync("INSERT INTO tasks (id, title, description, date, completed) VALUES ('test-2', 'Rendre le projet React Native', 'Vérifier la compatibilité Expo Go', '2026-06-28', 0);");
  await db.runAsync("INSERT INTO tasks (id, title, description, date, completed) VALUES ('test-3', 'Session de sport', '30 min de cardio', '2026-06-25', 1);");
};