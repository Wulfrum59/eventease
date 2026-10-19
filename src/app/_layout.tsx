import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { Text } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

// Composant séparé OBLIGATOIRE : useAuth() doit être appelé dans un enfant de <AuthProvider>.
// Dans RootLayout lui-même, le Provider n'existe pas encore au moment de l'appel.
function RootNavigator() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Text>Chargement de la session...</Text>;

  // Tant que la session n'est pas relue, on n'affiche rien (évite un flash de l'écran login)
  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Accessible uniquement si connecté */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      {/* Accessible uniquement si NON connecté */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}