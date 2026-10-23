import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
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
} from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { formatMonthYear } from "@/utils/date";

// Initiales affichées dans l'avatar : "Alice Martin" → "AM", "alice" → "A".
// Avatar généré localement, sans photo ni service externe.
function getInitials(name: string): string {
  // \s+ : un ou plusieurs espaces ; filter(Boolean) retire les morceaux vides
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2) // Deux initiales maximum
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

// Onglet « Profil » : informations du compte et déconnexion
export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Carte d'identité de l'utilisateur.
          user ne peut pas être null ici (écran protégé), mais TypeScript ne le sait pas : d'où le ?. */}
      <View style={styles.card}>
        {/* Décoratif : le nom est lu juste après, inutile de l'annoncer deux fois */}
        <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text style={styles.initials}>{getInitials(user?.name ?? "")}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user ? (
          <Text style={styles.memberSince}>Membre depuis {formatMonthYear(user.createdAt)}</Text>
        ) : null}
      </View>

      {/* Transparence RGPD : rappel de l'endroit où sont stockées les données */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vos données</Text>
        <Text style={styles.sectionText}>
          Votre compte et vos événements sont enregistrés uniquement sur cet appareil. Votre mot
          de passe n'est jamais conservé en clair.
        </Text>
      </View>

      {/* Pas de router.push après logout : le layout redirige tout seul */}
      <Button title="Se déconnecter" variant="danger" onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },

  // ----- Carte d'identité -----
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  avatar: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: radius.pill, // Coins arrondis au maximum : un cercle parfait
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    // Anneau clair autour de l'avatar
    borderWidth: borderWidth.thick,
    borderColor: colors.primarySoft,
  },
  initials: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.onPrimary,
    letterSpacing: letterSpacing.lg,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    textAlign: "center",
  },
  email: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: "center",
  },
  // Badge « Membre depuis »
  memberSince: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    overflow: "hidden", // Nécessaire pour que borderRadius s'applique au fond d'un Text
  },

  // ----- Section « Vos données » -----
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.md,
  },
  sectionText: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: lineHeight.sm,
  },
});
