// Le bloc date façon page d'agenda : jour de la semaine, numéro, mois.
// Utilisé sur les cartes de la liste (taille "md") et sur l'écran de détail (taille "lg").
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, fontWeight, letterSpacing, lineHeight, sizes, spacing } from "@/constants/theme";
import { getDateParts } from "@/utils/date"; // découpe la date en morceaux

// Les props acceptées
type DateBlockProps = {
  isoDate: string; // la date à afficher, en ISO
  isPast: boolean; // calculé par le parent, qui en a aussi besoin pour ses badges
  isToday: boolean; // pareil
  size?: "md" | "lg"; // taille du bloc, optionnelle
};

export function DateBlock({ isoDate, isPast, isToday, size = "md" }: DateBlockProps) {
  const { weekday, day, month } = getDateParts(isoDate); // "dim", 1, "nov"
  const isLarge = size === "lg"; // raccourci pour la grande taille

  // Les styles sont dans un tableau : quand une condition est false, React Native l'ignore.
  // Le jour même : fond indigo plein. Une fois passé : fond gris.
  return (
    <View
      style={[
        styles.block, // style de base
        isLarge ? styles.blockLg : styles.blockMd, // largeur selon la taille
        isToday && styles.blockToday, // fond indigo si c'est aujourd'hui
        isPast && styles.blockPast, // fond gris si c'est passé
      ]}
    >
      {/* Jour de la semaine : un peu plus grand en "lg", blanc si aujourd'hui */}
      <Text style={[styles.weekday, isLarge && styles.smallTextLg, isToday && styles.onPrimary]}>
        {weekday}
      </Text>
      {/* Le numéro du jour : plus gros en "lg", blanc si aujourd'hui, gris si passé */}
      <Text
        style={[styles.day, isLarge && styles.dayLg, isToday && styles.onPrimary, isPast && styles.muted]}
      >
        {day}
      </Text>
      {/* Le mois : même logique que le numéro */}
      <Text
        style={[styles.month, isLarge && styles.smallTextLg, isToday && styles.onPrimary, isPast && styles.muted]}
      >
        {month}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // ----- Le conteneur -----
  block: {
    alignItems: "center", // textes centrés horizontalement
    justifyContent: "center", // et verticalement
    backgroundColor: colors.primarySoft, // fond indigo clair par défaut
  },
  blockMd: {
    width: sizes.dateBlockMd, // largeur version liste
    paddingVertical: spacing.md, // espace en haut et en bas
  },
  blockLg: {
    width: sizes.dateBlockLg, // largeur version détail
    paddingVertical: spacing.lg, // plus d'espace
  },
  blockToday: {
    backgroundColor: colors.primary, // indigo plein
  },
  blockPast: {
    backgroundColor: colors.surfaceMuted, // gris
  },

  // ----- Les textes (taille "md" par défaut, certains changent en "lg") -----
  weekday: {
    fontSize: fontSize.xs, // petit
    fontWeight: fontWeight.semibold,
    color: colors.textMuted, // gris
    textTransform: "uppercase", // majuscules
    letterSpacing: letterSpacing.sm, // lettres un peu espacées
  },
  day: {
    fontSize: fontSize.xl, // gros numéro
    fontWeight: fontWeight.heavy, // très gras
    color: colors.text,
    lineHeight: lineHeight.xl,
  },
  dayLg: {
    fontSize: fontSize.xxl, // encore plus gros sur le détail
    lineHeight: lineHeight.xxl,
  },
  month: {
    fontSize: fontSize.xs, // petit
    fontWeight: fontWeight.bold,
    color: colors.primary, // indigo
    textTransform: "uppercase",
    letterSpacing: letterSpacing.sm,
  },
  smallTextLg: {
    fontSize: fontSize.sm, // jour et mois un peu plus grands en "lg"
  },

  // ----- Couleurs selon l'état -----
  onPrimary: {
    color: colors.onPrimary, // blanc sur fond indigo
  },
  muted: {
    color: colors.textMuted, // gris pour un événement passé
  },
});
