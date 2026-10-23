// Le bouton "Je participe / Annuler ma participation" de l'écran de détail.
// Une fois l'événement passé, il est remplacé par un simple message (on ne peut plus changer).
import { useState } from "react"; // pour savoir si un enregistrement est en cours
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button"; // notre bouton
import { colors, fontSize, fontWeight, radius, spacing } from "@/constants/theme"; // thème

// Les props acceptées
type ParticipationToggleProps = {
  isParticipating: boolean; // la personne participe déjà ?
  isPast: boolean; // l'événement est passé ?
  onToggle: () => Promise<void>; // l'action à lancer, choisie par le parent
};

export function ParticipationToggle({ isParticipating, isPast, onToggle }: ParticipationToggleProps) {
  // State local : il n'y a que ce composant qui a besoin de savoir qu'on enregistre
  const [isPending, setIsPending] = useState(false);

  // Appui sur le bouton : on lance l'action, et on affiche une alerte si ça plante
  async function handlePress() {
    setIsPending(true); // le bouton passe en "Enregistrement..."
    try {
      await onToggle(); // on inscrit ou désinscrit
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Action impossible."); // popup d'erreur
    } finally {
      setIsPending(false); // dans tous les cas on réactive le bouton
    }
  }

  // Événement fini : plus moyen de changer sa participation
  if (isPast) {
    return (
      <View style={styles.closedBox}>
        <Text style={styles.closed}>
          {isParticipating ? "Vous avez participé à cet événement." : "Événement terminé."}
        </Text>
      </View>
    );
  }

  // On calcule le texte du bouton à part, c'est plus lisible qu'un ternaire dans un ternaire
  let label = isParticipating ? "Annuler ma participation" : "Je participe";
  if (isPending) label = "Enregistrement..."; // pendant l'envoi, on écrase le texte

  return (
    <View style={styles.container}>
      {/* Encadré vert si la personne participe déjà */}
      {isParticipating ? (
        <View style={styles.statusBox}>
          <Text style={styles.status}>✓ Vous participez à cet événement.</Text>
        </View>
      ) : null}
      <Button
        title={label}
        variant={isParticipating ? "danger" : "primary"} // rouge pour annuler, indigo pour participer
        onPress={handlePress}
        disabled={isPending} // pas de double appui pendant l'enregistrement
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm, // espace entre l'encadré et le bouton
  },
  // Encadré vert pâle qui confirme l'inscription
  statusBox: {
    backgroundColor: colors.successSoft, // fond vert clair
    borderRadius: radius.md, // coins arrondis
    paddingVertical: spacing.ms, // espace en haut et en bas
    paddingHorizontal: spacing.md, // espace sur les côtés
  },
  status: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.success, // texte vert
  },
  // Encadré gris quand l'événement est fini
  closedBox: {
    backgroundColor: colors.surfaceMuted, // fond gris
    borderRadius: radius.md,
    paddingVertical: spacing.ms,
    paddingHorizontal: spacing.md,
  },
  closed: {
    fontSize: fontSize.md,
    color: colors.textMuted, // texte gris
    textAlign: "center", // centré
  },
});
