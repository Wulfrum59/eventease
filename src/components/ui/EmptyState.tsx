// Écran d'info passe-partout : liste vide, erreur, événement introuvable...
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button"; // notre bouton
import { colors, fontSize, fontWeight, spacing } from "@/constants/theme"; // valeurs du thème

// Les props acceptées
type EmptyStateProps = {
  title: string; // le titre en gros
  message: string; // le texte en dessous
  actionLabel?: string; // texte d'un bouton optionnel (genre "Réessayer")
  onAction?: () => void; // ce que fait ce bouton
};

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {/* Le bouton s'affiche seulement si on a reçu le texte ET l'action */}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // prend toute la place
    alignItems: "center", // centré horizontalement
    justifyContent: "center", // centré verticalement
    padding: spacing.xl, // bien de l'espace autour
    gap: spacing.md, // espace entre le titre, le message et le bouton
  },
  title: {
    fontSize: fontSize.lg, // assez gros
    fontWeight: fontWeight.bold, // gras
    color: colors.text,
    textAlign: "center", // texte centré
  },
  message: {
    fontSize: fontSize.md,
    color: colors.textMuted, // gris, plus discret
    textAlign: "center",
  },
});
