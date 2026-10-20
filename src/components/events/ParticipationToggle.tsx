// src/components/events/ParticipationToggle.tsx
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { colors, fontSize, spacing } from "@/constants/theme";

type ParticipationToggleProps = {
  isParticipating: boolean;
  isPast: boolean;
  onToggle: () => Promise<void>; // Le parent décide de l'action (ici : toggleParticipation)
};

export function ParticipationToggle({ isParticipating, isPast, onToggle }: ParticipationToggleProps) {
  // State LOCAL : seul ce composant a besoin de savoir qu'un enregistrement est en cours
  const [isPending, setIsPending] = useState(false);

  async function handlePress() {
    setIsPending(true);
    try {
      await onToggle();
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Action impossible.");
    } finally {
      setIsPending(false);
    }
  }

  // Événement terminé : plus de changement de participation possible
  if (isPast) {
    return (
      <Text style={styles.closed}>
        {isParticipating ? "Vous avez participé à cet événement." : "Événement terminé."}
      </Text>
    );
  }

  // Libellé calculé à part : plus lisible qu'un ternaire imbriqué dans le JSX
  let label = isParticipating ? "Annuler ma participation" : "Je participe";
  if (isPending) label = "Enregistrement...";

  return (
    <View style={styles.container}>
      {isParticipating ? <Text style={styles.status}>✓ Vous participez à cet événement.</Text> : null}
      <Button
        title={label}
        variant={isParticipating ? "danger" : "primary"}
        onPress={handlePress}
        disabled={isPending} // Empêche le double appui pendant l'écriture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  status: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.success,
  },
  closed: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    fontStyle: "italic",
  },
});