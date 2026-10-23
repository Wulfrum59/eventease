// Bloc date façon page d'agenda (jour de la semaine, numéro, mois).
// Utilisé par la carte de la liste (taille "md") et par l'écran de détail (taille "lg").
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, fontWeight, letterSpacing, lineHeight, sizes, spacing } from "@/constants/theme";
import { getDateParts } from "@/utils/date";

type DateBlockProps = {
  isoDate: string;
  isPast: boolean; // Calculés par le parent, qui en a aussi besoin pour ses badges
  isToday: boolean;
  size?: "md" | "lg";
};

export function DateBlock({ isoDate, isPast, isToday, size = "md" }: DateBlockProps) {
  const { weekday, day, month } = getDateParts(isoDate);
  const isLarge = size === "lg";

  // Les styles sont combinés dans un tableau : false est ignoré par React Native,
  // donc un style ne s'applique que si sa condition est vraie.
  // Le jour même : fond indigo plein. Une fois passé : fond grisé.
  return (
    <View
      style={[
        styles.block,
        isLarge ? styles.blockLg : styles.blockMd,
        isToday && styles.blockToday,
        isPast && styles.blockPast,
      ]}
    >
      <Text style={[styles.weekday, isLarge && styles.smallTextLg, isToday && styles.onPrimary]}>
        {weekday}
      </Text>
      <Text
        style={[styles.day, isLarge && styles.dayLg, isToday && styles.onPrimary, isPast && styles.muted]}
      >
        {day}
      </Text>
      <Text
        style={[styles.month, isLarge && styles.smallTextLg, isToday && styles.onPrimary, isPast && styles.muted]}
      >
        {month}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // ----- Conteneur -----
  block: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  blockMd: {
    width: sizes.dateBlockMd,
    paddingVertical: spacing.md,
  },
  blockLg: {
    width: sizes.dateBlockLg,
    paddingVertical: spacing.lg,
  },
  blockToday: {
    backgroundColor: colors.primary,
  },
  blockPast: {
    backgroundColor: colors.surfaceMuted,
  },

  // ----- Textes (taille "md" par défaut, surchargée en "lg") -----
  weekday: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.sm,
  },
  day: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    lineHeight: lineHeight.xl,
  },
  dayLg: {
    fontSize: fontSize.xxl,
    lineHeight: lineHeight.xxl,
  },
  month: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.sm,
  },
  smallTextLg: {
    fontSize: fontSize.sm, // Jour de la semaine et mois un peu plus grands en taille "lg"
  },

  // ----- Couleurs selon l'état -----
  onPrimary: {
    color: colors.onPrimary,
  },
  muted: {
    color: colors.textMuted,
  },
});
