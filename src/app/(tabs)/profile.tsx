import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button"; // notre bouton
import {
  borderWidth,
  colors,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  sizes,
  spacing,
} from "@/constants/theme"; // thème
import { useAuth } from "@/hooks/useAuth"; // qui est connecté + déconnexion
import { formatMonthYear } from "@/utils/date"; // "novembre 2026"

// Les initiales dans l'avatar : "Alice Martin" → "AM", "alice" → "A".
// Tout est fait en local, pas de photo ni de service externe.
function getInitials(name: string): string {
  // \s+ = un ou plusieurs espaces ; filter(Boolean) vire les morceaux vides
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?"; // pas de nom : on met un point d'interrogation
  return words
    .slice(0, 2) // on garde les 2 premiers mots max
    .map((word) => word.charAt(0).toUpperCase()) // la première lettre de chaque, en majuscule
    .join(""); // on colle le tout
}

// L'onglet Profil : infos du compte + déconnexion
export default function ProfileScreen() {
  const { user, logout } = useAuth(); // la personne connectée et la fonction de déconnexion

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* La carte d'identité.
          user ne peut pas être null ici (écran protégé), mais TypeScript ne le sait pas, d'où les ?. */}
      <View style={styles.card}>
        {/* Juste déco : le nom est lu juste après, pas besoin de l'annoncer deux fois */}
        <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text style={styles.initials}>{getInitials(user?.name ?? "")}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {/* Le badge "Membre depuis", seulement si on a bien un user */}
        {user ? (
          <Text style={styles.memberSince}>Membre depuis {formatMonthYear(user.createdAt)}</Text>
        ) : null}
      </View>

      {/* RGPD : on rappelle où sont rangées les données */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vos données</Text>
        <Text style={styles.sectionText}>
          Votre compte et vos événements sont enregistrés uniquement sur cet appareil. Votre mot
          de passe n'est jamais conservé en clair.
        </Text>
      </View>

      {/* Pas de router.push après logout : le layout renvoie tout seul sur la connexion */}
      <Button title="Se déconnecter" variant="danger" onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // tout l'écran
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg, // marge autour
    gap: spacing.md, // espace entre les blocs
  },

  // ----- La carte d'identité -----
  card: {
    alignItems: "center", // tout centré
    backgroundColor: colors.surface, // fond blanc
    borderRadius: radius.lg, // coins arrondis
    borderWidth: borderWidth.thin, // bordure fine
    borderColor: colors.border,
    paddingVertical: spacing.xl, // beaucoup d'espace en haut et en bas
    paddingHorizontal: spacing.lg, // espace sur les côtés
    gap: spacing.xs, // petit espace entre les lignes
  },
  avatar: {
    width: sizes.avatar, // carré...
    height: sizes.avatar,
    borderRadius: radius.pill, // ...avec l'arrondi max, ça fait un cercle
    backgroundColor: colors.primary, // fond indigo
    alignItems: "center", // initiales centrées horizontalement
    justifyContent: "center", // et verticalement
    marginBottom: spacing.md, // espace avant le nom
    // L'anneau clair autour de l'avatar
    borderWidth: borderWidth.thick, // bordure épaisse
    borderColor: colors.primarySoft, // indigo clair
  },
  initials: {
    fontSize: fontSize.xl, // gros
    fontWeight: fontWeight.heavy, // très gras
    color: colors.onPrimary, // blanc
    letterSpacing: letterSpacing.lg, // lettres un peu espacées
  },
  name: {
    fontSize: fontSize.xl, // gros
    fontWeight: fontWeight.heavy,
    color: colors.text,
    textAlign: "center",
  },
  email: {
    fontSize: fontSize.md,
    color: colors.textMuted, // gris
    textAlign: "center",
  },
  // Le badge "Membre depuis"
  memberSince: {
    marginTop: spacing.sm, // un peu d'air au-dessus
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary, // texte indigo
    backgroundColor: colors.primarySoft, // fond indigo clair
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill, // forme pilule
    overflow: "hidden", // sinon l'arrondi ne s'applique pas au fond d'un Text
  },

  // ----- La section "Vos données" -----
  section: {
    backgroundColor: colors.surface, // fond blanc
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    padding: spacing.md, // espace intérieur
    gap: spacing.sm, // espace entre le titre et le texte
  },
  sectionTitle: {
    fontSize: fontSize.xs, // petit
    fontWeight: fontWeight.bold,
    color: colors.textMuted, // gris
    textTransform: "uppercase", // majuscules
    letterSpacing: letterSpacing.md,
  },
  sectionText: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: lineHeight.sm, // lignes aérées
  },
});
