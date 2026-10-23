// Le bouton de l'app, en deux versions : "primary" (action normale) et "danger" (supprimer, annuler...)
import { Pressable, StyleSheet, Text } from "react-native"; // Pressable = zone qui réagit au doigt

import { colors, fontSize, fontWeight, opacity, radius, spacing } from "@/constants/theme"; // valeurs du thème

// Les props que le bouton accepte
type ButtonProps = {
  title: string; // texte du bouton
  onPress: () => void; // ce qui se passe quand on appuie
  variant?: "primary" | "danger"; // seulement ces deux valeurs possibles, et c'est optionnel
  disabled?: boolean; // désactivé ou pas, optionnel aussi
};

export function Button({
  title,
  onPress,
  variant = "primary", // si le parent ne dit rien, c'est un bouton normal
  disabled = false, // et il est actif
}: ButtonProps) {
  const isDanger = variant === "danger"; // raccourci pour savoir si c'est un bouton rouge

  return (
    <Pressable
      onPress={onPress} // on déclenche l'action du parent
      disabled={disabled} // quand c'est true, Pressable ignore les appuis
      accessibilityRole="button" // le lecteur d'écran annonce "bouton"
      accessibilityState={{ disabled }} // et il dit aussi s'il est désactivé
      // style peut être une fonction : React Native nous dit si on est en train d'appuyer
      style={({ pressed }) => [
        styles.base, // le style commun
        isDanger ? styles.danger : styles.primary, // fond rose ou indigo
        pressed && styles.pressed, // si pressed est false, React Native l'ignore
        disabled && styles.disabled, // en dernier pour passer devant les autres
      ]}
    >
      {/* Le texte du bouton, rouge ou blanc selon la version */}
      <Text style={[styles.title, isDanger ? styles.dangerTitle : styles.primaryTitle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ----- Le fond du bouton -----
  base: {
    paddingVertical: spacing.ms, // espace en haut et en bas
    paddingHorizontal: spacing.lg, // espace à gauche et à droite
    borderRadius: radius.md, // coins arrondis
    alignItems: "center", // texte centré horizontalement
  },
  primary: {
    backgroundColor: colors.primary, // fond indigo
  },
  // Danger en version douce : fond rosé et texte rouge, moins agressif qu'un gros bloc rouge
  danger: {
    backgroundColor: colors.dangerSoft, // fond rose pâle
  },
  pressed: {
    opacity: opacity.pressed, // un peu transparent pendant l'appui
  },
  disabled: {
    opacity: opacity.disabled, // à moitié transparent quand désactivé
  },

  // ----- Le texte du bouton -----
  title: {
    fontSize: fontSize.md, // taille normale
    fontWeight: fontWeight.semibold, // un peu gras
  },
  primaryTitle: {
    color: colors.onPrimary, // blanc sur l'indigo
  },
  dangerTitle: {
    color: colors.danger, // rouge sur le rose
  },
});
