// Champ de saisie avec libellé et message d'erreur, basé sur le TextInput natif.
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { borderWidth, colors, fontSize, fontWeight, letterSpacing, radius, spacing } from "@/constants/theme";

// Toutes les props natives de TextInput (value, onChangeText, secureTextEntry...) + les nôtres
type InputProps = TextInputProps & {
  label: string;
  error?: string;
};

// "...textInputProps" récupère toutes les props qu'on n'a pas nommées dans la déstructuration
export function Input({ label, error, style, onFocus, onBlur, ...textInputProps }: InputProps) {
  // Purement visuel : bordure indigo tant que le champ a le focus
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        // "style" du parent en dernier : il peut compléter ou remplacer nos styles
        style={[styles.input, isFocused && styles.inputFocused, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textMuted}
        {...textInputProps} // Transmet toutes les autres props au TextInput natif
        // Après le spread : on garde notre gestion du focus ET on appelle celle du parent s'il en passe une
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
      />
      {/* Ternaire plutôt que && : avec une chaîne vide, && afficherait "" hors d'un <Text> et ferait planter l'app */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    alignSelf: "stretch", // Prend toute la largeur disponible
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.ms,
    fontSize: fontSize.md,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.danger, // Après inputFocused : l'erreur reste visible même avec le focus
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
  },
});
