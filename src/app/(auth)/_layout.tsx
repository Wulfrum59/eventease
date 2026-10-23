import { Stack } from "expo-router";

import { colors, fontSize, fontWeight } from "@/constants/theme";

// Navigation entre les écrans de connexion et d'inscription
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        // Même rendu de header que le reste de l'app
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.primary, // Couleur de la flèche retour
        headerTitleStyle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {/* Pas de header sur la connexion : l'écran a déjà son propre en-tête (et pas de retour possible) */}
      <Stack.Screen name="login" options={{ title: "Connexion", headerShown: false }} />
      <Stack.Screen name="register" options={{ title: "Inscription" }} />
    </Stack>
  );
}
