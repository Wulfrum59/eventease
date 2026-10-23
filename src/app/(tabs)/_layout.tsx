import { Link, Tabs } from "expo-router"; // Link = lien, Tabs = barre d'onglets
import { StyleSheet } from "react-native";

import { TabIcon } from "@/components/ui/TabIcon"; // l'icône des onglets
import { colors, fontSize, fontWeight, radius, spacing } from "@/constants/theme"; // thème

// La barre d'onglets en bas : Événements et Profil
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // La barre d'onglets
        tabBarActiveTintColor: colors.primary, // onglet actif en indigo
        tabBarInactiveTintColor: colors.textMuted, // les autres en gris
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border }, // fond blanc + trait en haut
        // Texte des onglets un peu gras. On ne touche pas à sa taille : la barre réserve sous l'icône
        // une hauteur prévue pour sa taille par défaut, un texte plus grand serait coupé
        tabBarLabelStyle: { fontWeight: fontWeight.semibold },
        // Le header se fond dans le fond de l'écran, sans ombre
        headerStyle: { backgroundColor: colors.background }, // fond du header
        headerShadowVisible: false, // pas d'ombre
        headerTitleStyle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text }, // le titre
      }}
    >
      {/* Onglet Événements (fichier index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Événements", // titre du header et de l'onglet
          // L'icône de l'onglet : la barre nous donne la couleur et la taille à utiliser
          tabBarIcon: ({ color, size }) => (
            <TabIcon name={{ ios: "list.bullet", android: "view_agenda", web: "view_agenda" }} color={color} size={size} />
          ),
          // Bouton "+ Ajouter" à droite du header, seulement sur cet onglet
          headerRight: () => (
            <Link href="/event/form" style={styles.addLink}>
              + Ajouter
            </Link>
          ),
        }}
      />
      {/* Onglet Profil (fichier profile.tsx) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil", // titre du header et de l'onglet
          // Icône "personne"
          tabBarIcon: ({ color, size }) => (
            <TabIcon name={{ ios: "person.crop.circle", android: "person", web: "person" }} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Le lien "+ Ajouter" en forme de pilule indigo
  addLink: {
    color: colors.onPrimary, // texte blanc
    backgroundColor: colors.primary, // fond indigo
    fontSize: fontSize.sm, // petit texte
    fontWeight: fontWeight.bold, // gras
    paddingHorizontal: spacing.md, // espace sur les côtés
    paddingVertical: spacing.xs, // un peu en haut et en bas
    borderRadius: radius.pill, // forme pilule
    overflow: "hidden", // sinon l'arrondi ne s'applique pas au fond d'un Text
    marginRight: spacing.md, // pas collé au bord droit
  },
});
