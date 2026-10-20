import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { EventsProvider } from "@/context/EventsContext";

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
    <Stack screenOptions={{ headerShown: false }}>
      {/* Accessible uniquement si connecté */}
      <Stack.Protected guard={!!user}>
  <Stack.Screen name="(tabs)" />
  {/* Écran hors onglets : header affiché (le Stack racine les masque par défaut) */}
  <Stack.Screen name="event/form" options={{ headerShown: true }} />
</Stack.Protected>
    </Stack>
  );
}