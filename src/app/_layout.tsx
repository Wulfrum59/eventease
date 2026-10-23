import { Stack } from "expo-router"; // navigation en pile (un écran par-dessus l'autre)
import * as SplashScreen from "expo-splash-screen"; // l'écran de démarrage (logo sur fond indigo)
import { useEffect } from "react"; // pour cacher le splash au bon moment

import { colors, fontSize, fontWeight } from "@/constants/theme"; // thème
import { AuthProvider } from "@/context/AuthContext"; // fournit la connexion
import { EventsProvider } from "@/context/EventsContext"; // fournit les événements
import { useAuth } from "@/hooks/useAuth"; // pour savoir qui est connecté

// On demande au splash de rester affiché jusqu'à ce qu'on le cache nous-mêmes.
// Appelé ici, en dehors de tout composant, pour que ça passe avant que le splash disparaisse tout seul
SplashScreen.preventAutoHideAsync();

// Le layout racine : il enveloppe toute l'app avec les contextes
export default function RootLayout() {
  return (
    <AuthProvider>
      {/* EventsProvider est dedans parce qu'il a besoin de useAuth() */}
      <EventsProvider>
        <RootNavigator />
      </EventsProvider>
    </AuthProvider>
  );
}

// Composant à part obligé : useAuth() doit être appelé dans un enfant d'<AuthProvider>.
// Dans RootLayout lui-même, le Provider n'existe pas encore au moment de l'appel.
function RootNavigator() {
  const { user, isLoading } = useAuth(); // qui est connecté, et est-ce qu'on charge encore

  // Dès que la session est relue, on cache le splash
  useEffect(() => {
    if (!isLoading) SplashScreen.hide(); // isLoading passe à false → on affiche l'app
  }, [isLoading]); // relancé à chaque changement de isLoading

  // Tant qu'on n'a pas relu la session, le splash reste devant et on ne rend rien derrière
  // (sinon on verrait la page de connexion clignoter)
  if (isLoading) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false, // pas de header par défaut
        // Style des headers quand on les affiche (détail, formulaire) : pareil que les onglets
        headerStyle: { backgroundColor: colors.background }, // fond du header
        headerShadowVisible: false, // pas d'ombre sous le header
        headerTintColor: colors.primary, // couleur de la flèche retour
        headerTitleStyle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text }, // le titre
        contentStyle: { backgroundColor: colors.background }, // fond derrière les écrans
      }}
    >
      {/* Ces écrans-là ne sont dispo que si on est connecté */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
        {/* Écrans en dehors des onglets : on remet le header pour avoir la flèche retour */}
        <Stack.Screen name="event/form" options={{ headerShown: true }} />
        <Stack.Screen name="event/[id]" options={{ headerShown: true, title: "Détail" }} />
      </Stack.Protected>

      {/* Et ceux-là seulement si on n'est pas connecté */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
