// Bouton de l'app, en deux variantes : "primary" (action principale) et "danger" (action destructive).
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fontSize, fontWeight, opacity, radius, spacing } from "@/constants/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger"; // Union de chaînes : seules ces deux valeurs sont acceptées
  disabled?: boolean;
};

export function Button({
  title,
  onPress,
  variant = "primary", // Valeur par défaut si le parent ne passe pas la prop
  disabled = false,
}: ButtonProps) {
  const isDanger = variant === "danger";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled} // Pressable ignore les appuis quand disabled vaut true
      accessibilityRole="button" // Annoncé comme « bouton » par le lecteur d'écran
      accessibilityState={{ disabled }}
      // style reçoit une fonction : React Native l'appelle avec l'état d'appui
      style={({ pressed }) => [
        styles.base,
        isDanger ? styles.danger : styles.primary,
        pressed && styles.pressed, // false est ignoré : le style ne s'applique que si pressed
        disabled && styles.disabled, // En dernier : prioritaire sur les styles précédents
      ]}
    >
      <Text style={[styles.title, isDanger ? styles.dangerTitle : styles.primaryTitle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ----- Fond du bouton -----
  base: {
    paddingVertical: spacing.ms,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center", // Centre le texte horizontalement
  },
  primary: {
    backgroundColor: colors.primary,
  },
  // Danger en version « douce » : fond rosé et texte rouge, moins agressif qu'un aplat rouge
  danger: {
    backgroundColor: colors.dangerSoft,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },

  // ----- Texte du bouton -----
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  primaryTitle: {
    color: colors.onPrimary,
  },
  dangerTitle: {
    color: colors.danger,
  },
});
