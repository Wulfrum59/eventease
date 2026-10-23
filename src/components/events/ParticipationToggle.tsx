// Bouton « Je participe / Annuler ma participation » de l'écran de détail.
// Une fois l'événement passé, il est remplacé par un simple message (participation figée).
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { colors, fontSize, fontWeight, radius, spacing } from "@/constants/theme";

type ParticipationToggleProps = {
  isParticipating: boolean;
  isPast: boolean;
  onToggle: () => Promise<void>; // Le parent décide de l'action (ici : toggleParticipation)
};

export function ParticipationToggle({ isParticipating, isPast, onToggle }: ParticipationToggleProps) {
  // State LOCAL : seul ce composant a besoin de savoir qu'un enregistrement est en cours
  const [isPending, setIsPending] = useState(false);

  // Appui sur le bouton : on lance l'action et on affiche une alerte en cas d'erreur
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
      <View style={styles.closedBox}>
        <Text style={styles.closed}>
          {isParticipating ? "Vous avez participé à cet événement." : "Événement terminé."}
        </Text>
      </View>
    );
  }

  // Libellé calculé à part : plus lisible qu'un ternaire imbriqué dans le JSX
  let label = isParticipating ? "Annuler ma participation" : "Je participe";
  if (isPending) label = "Enregistrement...";

  return (
    <View style={styles.container}>
      {isParticipating ? (
        <View style={styles.statusBox}>
          <Text style={styles.status}>✓ Vous participez à cet événement.</Text>
        </View>
      ) : null}
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
  // Encadré vert pâle : confirmation visuelle de l'inscription
  statusBox: {
    backgroundColor: colors.successSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.ms,
    paddingHorizontal: spacing.md,
  },
  status: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.success,
  },
  // Encadré grisé : événement terminé
  closedBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingVertical: spacing.ms,
    paddingHorizontal: spacing.md,
  },
  closed: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: "center",
  },
});
