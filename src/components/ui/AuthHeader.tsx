// En-tête des écrans connexion / inscription : petite icône calendrier + titre + sous-titre.
// L'icône est dessinée avec des View, pas d'image à charger.
import { StyleSheet, Text, View } from "react-native";

import { borderWidth, colors, fontSize, fontWeight, lineHeight, radius, sizes, spacing } from "@/constants/theme";

// Les props acceptées
type AuthHeaderProps = {
  title: string; // le gros titre
  subtitle: string; // la phrase en dessous
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const today = new Date().getDate(); // le numéro du jour, affiché dans l'icône

  return (
    <View style={styles.container}>
      {/* L'icône calendrier, juste déco : on la cache au lecteur d'écran */}
      <View style={styles.icon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {/* La bande du haut avec les deux anneaux */}
        <View style={styles.iconBand}>
          <View style={styles.ring} />
          <View style={styles.ring} />
        </View>
        {/* Le bas de l'icône : le numéro du jour, centré dans la place qui reste */}
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
    alignItems: "center", // tout centré horizontalement
    gap: spacing.xs, // petit espace entre les éléments
    marginBottom: spacing.sm, // un peu d'air en dessous
  },

  // ----- L'icône calendrier -----
  icon: {
    width: sizes.authIcon, // carré
    height: sizes.authIcon,
    borderRadius: radius.lg, // coins arrondis
    backgroundColor: colors.surface, // fond blanc
    borderWidth: borderWidth.thin, // bordure fine
    borderColor: colors.border,
    overflow: "hidden", // la bande indigo est coupée par les coins arrondis
    marginBottom: spacing.md, // espace avant le titre
  },
  iconBand: {
    height: sizes.authIconBand, // hauteur de la bande
    backgroundColor: colors.primary, // indigo
    flexDirection: "row", // les anneaux côte à côte
    justifyContent: "space-around", // répartis sur la largeur
    alignItems: "center", // centrés verticalement dans la bande
    paddingHorizontal: spacing.md, // pas collés aux bords
  },
  ring: {
    width: sizes.authIconRing, // petit rond
    height: sizes.authIconRing,
    borderRadius: radius.pill, // arrondi max = cercle
    backgroundColor: colors.onPrimary, // blanc
  },
  iconBody: {
    flex: 1, // prend toute la hauteur sous la bande
    alignItems: "center", // centre le chiffre horizontalement
    justifyContent: "center", // et verticalement
  },
  iconDay: {
    fontSize: fontSize.xl, // gros chiffre
    fontWeight: fontWeight.heavy, // très gras
    color: colors.text,
  },

  // ----- Les textes -----
  title: {
    fontSize: fontSize.xl, // gros
    fontWeight: fontWeight.heavy, // très gras
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted, // gris
    textAlign: "center",
    lineHeight: lineHeight.md, // lignes un peu aérées
  },
});
