// src/app/(tabs)/_layout.tsx
import { Link, Tabs } from "expo-router";
import { StyleSheet } from "react-native";

import { colors, spacing } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary }}>
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
  addLink: {
    color: colors.primary,
    fontWeight: "600",
    marginRight: spacing.md,
  },
});