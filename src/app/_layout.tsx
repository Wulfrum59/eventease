import { Stack } from "expo-router";

import { colors, fontSize, fontWeight } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { EventsProvider } from "@/context/EventsContext";
import { useAuth } from "@/hooks/useAuth";

// Layout racine : met en place les contextes partagés par toute l'app
export default function RootLayout() {
  return (
    <AuthProvider>
      {/* À l'intérieur d'AuthProvider : EventsProvider utilise useAuth() */}
      <EventsProvider>
        <RootNavigator />
      </EventsProvider>
    </AuthProvider>
  );
}

// Composant séparé OBLIGATOIRE : useAuth() doit être appelé dans un enfant de <AuthProvider>.
// Dans RootLayout lui-même, le Provider n'existe pas encore au moment de l'appel.
function RootNavigator() {
  const { user, isLoading } = useAuth();

  // Tant que la session n'est pas relue, on n'affiche rien (évite un flash de l'écran login)
  if (isLoading) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Style des headers affichés (détail, formulaire) : même rendu que les onglets
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.primary, // Couleur de la flèche retour
        headerTitleStyle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {/* Écrans accessibles uniquement si connecté */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
        {/* Écrans hors onglets : header affiché (le Stack racine les masque par défaut) */}
        <Stack.Screen name="event/form" options={{ headerShown: true }} />
        <Stack.Screen name="event/[id]" options={{ headerShown: true, title: "Détail" }} />
      </Stack.Protected>

      {/* Écrans accessibles uniquement si NON connecté */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
