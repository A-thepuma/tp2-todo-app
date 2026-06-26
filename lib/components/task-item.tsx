import { useCallback, useEffect, useState, type FC } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Checkbox } from "./checkbox";
import { TodoTitle } from "./task-title";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import type { TaskItemData } from "@/lib/types/taskItemData";

type Props = {
  /**
   * Les données de la tâche à afficher
   */
  task: TaskItemData;
  /**
   * Callback appelé lors d'une pression longue sur la tâche
   * @returns 
   */
  onLongPress?: () => void;
  /**
   * Callback appelé lorsque la tâche change de statut.
   * L'argment `completed` reflète l'état de la case à cocher.
   */
  onChange?: (completed: boolean) => Promise<void> | void;
  /**
   * Utilisé pour bloquer les actions du composant lors d'un chargement par exemple 
   */
  disabled?: boolean;
};

/**
 * Affichage d'une tâche sur la page d'accueil
 */
export const TaskItem: FC<Props> = function ({task, onLongPress, onChange, disabled = false}) {
  const completed = task.completed;

  // Gère l'animation de pression longue lorsque l'on reste appuyé sur la tâche et que cela ouvre l'écran d'édition
  const pressed = useSharedValue<boolean>(false);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(pressed.value ? 0.6 : 1, {
      easing: Easing.inOut(Easing.quad)
    }),
    transform: [
      {
        scale: withTiming(pressed.value ? 0.95 : 1, {
          duration: 500,
          easing: Easing.inOut(Easing.quad)
        }),
      }
    ]
  }));

  const handlePress = () => {
    onChange?.(!completed);
  };

  // Lors d'une pression longue, ouvre l'écran d'édition de la tâche
  const handleLongPress = useCallback(() => {
    pressed.set(false);
    onLongPress?.();
  }, [])

  // Modifie l'opacité de la tâche lorsque celle-ci est complétée
  const opacity = useSharedValue(task.completed ? 0.5 : 1);
  useEffect(() => {
    opacity.value = withTiming(completed ? 0.5 : 1, {
      duration: 200,
      easing: Easing.inOut(Easing.bounce)
    })
  }, [completed]);


  return <Pressable
    onPress={handlePress}
    onPressIn={() => pressed.set(true)}
    onPressOut={() => pressed.set(false)}
    disabled={disabled}
    onLongPress={handleLongPress}
  >
    <Animated.View style={animatedStyles}>
      <Animated.View style={{ opacity }}>

        {/* Task Header */}
        <View style={styles.header}>
          {/* Case à cocher */}
          <Checkbox size={10}
            checked={completed}
            disabled={disabled}
            onValueChange={handlePress}
          />

          {/* Titre */}
          <TodoTitle
            title={task.title}
            completed={completed}
          />
        </View>

        {/* Task Description */}
        {task.description && <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{task.description}</Text>
        </View>
        }
      </Animated.View>
    </Animated.View>
  </Pressable>;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  description: {
    color: "#888",
    fontWeight: "600"
  },
  descriptionContainer: {
    marginTop: 8,
    marginLeft: 28
  }
});