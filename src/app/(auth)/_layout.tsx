import { Stack } from "expo-router"; // navigation en pile

import { colors, fontSize, fontWeight } from "@/constants/theme"; // thème

// La navigation entre la connexion et l'inscription
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        // Même look de header que dans le reste de l'app
        headerStyle: { backgroundColor: colors.background }, // fond du header
        headerShadowVisible: false, // pas d'ombre
        headerTintColor: colors.primary, // couleur de la flèche retour
        headerTitleStyle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text }, // le titre
        contentStyle: { backgroundColor: colors.background }, // fond derrière les écrans
      }}
    >
      {/* Pas de header sur la connexion : l'écran a déjà son en-tête, et il n'y a pas de retour possible */}
      <Stack.Screen name="login" options={{ title: "Connexion", headerShown: false }} />
      {/* Sur l'inscription on garde le header pour la flèche retour */}
      <Stack.Screen name="register" options={{ title: "Inscription" }} />
    </Stack>
  );
}
