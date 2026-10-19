// src/components/ui/EmptyState.tsx
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { colors, fontSize, spacing } from "@/constants/theme";

// Écran d'information générique : liste vide, erreur, etc.
type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string; // Bouton optionnel (ex : « Réessayer »)
  onAction?: () => void;
};

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {/* Le bouton n'apparaît que si les DEUX props sont fournies */}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  message: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: "center",
  },
});