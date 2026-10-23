import { Link, Tabs } from "expo-router";
import { StyleSheet } from "react-native";

import { colors, fontSize, fontWeight, radius, spacing } from "@/constants/theme";

// Barre d'onglets en bas de l'écran : Événements et Profil
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // Barre d'onglets
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
        // Header fondu dans le fond de l'écran, sans ombre
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Événements",
          // Bouton dans le header, à droite, uniquement sur l'onglet Événements
          headerRight: () => (
            <Link href="/event/form" style={styles.addLink}>
              + Ajouter
            </Link>
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Lien en forme de pilule indigo
  addLink: {
    color: colors.onPrimary,
    backgroundColor: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    overflow: "hidden", // Nécessaire pour que borderRadius s'applique au fond d'un Text
    marginRight: spacing.md,
  },
});
