import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fontSize, opacity, radius, spacing } from "@/constants/theme";

// Type des props déclaré dans le fichier du composant : il ne sert qu'ici
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
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled} // Pressable ignore les appuis quand disabled vaut true
      accessibilityRole="button" // Annoncé comme « bouton » par le lecteur d'écran
      accessibilityState={{ disabled }}
      // style reçoit une fonction : React Native l'appelle avec l'état d'appui
      style={({ pressed }) => [
        styles.base,
        variant === "danger" ? styles.danger : styles.primary,
        pressed && styles.pressed, // false est ignoré : le style ne s'applique que si pressed
        disabled && styles.disabled, // En dernier : prioritaire sur les styles précédents
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center", // Centre le texte horizontalement (axe secondaire d'une colonne)
  },
  primary: {
    backgroundColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  title: {
    color: colors.onPrimary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});