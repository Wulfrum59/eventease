// En-tête des écrans de connexion / inscription : icône calendrier + titre + sous-titre.
// L'icône est dessinée avec des View : aucune image ni ressource externe à charger.
import { StyleSheet, Text, View } from "react-native";

import { borderWidth, colors, fontSize, fontWeight, lineHeight, radius, sizes, spacing } from "@/constants/theme";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const today = new Date().getDate(); // L'icône affiche le jour du mois courant

  return (
    <View style={styles.container}>
      {/* Icône calendrier, purement décorative : masquée au lecteur d'écran */}
      <View style={styles.icon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {/* Bande du haut avec les deux anneaux de reliure */}
        <View style={styles.iconBand}>
          <View style={styles.ring} />
          <View style={styles.ring} />
        </View>
        {/* Zone du bas : le numéro du jour, centré dans la place restante */}
        <View style={styles.iconBody}>
          <Text style={styles.iconDay}>{today}</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },

  // ----- Icône calendrier -----
  icon: {
    width: sizes.authIcon,
    height: sizes.authIcon,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    overflow: "hidden", // La bande indigo suit les coins arrondis
    marginBottom: spacing.md,
  },
  iconBand: {
    height: sizes.authIconBand,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  ring: {
    width: sizes.authIconRing,
    height: sizes.authIconRing,
    borderRadius: radius.pill, // Coins arrondis au maximum : un cercle
    backgroundColor: colors.onPrimary,
  },
  iconBody: {
    flex: 1, // Prend toute la hauteur sous la bande
    alignItems: "center",
    justifyContent: "center",
  },
  iconDay: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },

  // ----- Textes -----
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: lineHeight.md,
  },
});
