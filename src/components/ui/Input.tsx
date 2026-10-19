// src/components/ui/Input.tsx
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { colors, fontSize, radius, spacing } from "@/constants/theme";

// Toutes les props natives de TextInput (value, onChangeText, secureTextEntry...) + les nôtres
type InputProps = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, style, ...textInputProps }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textMuted}
        {...textInputProps} // Transmet toutes les autres props au TextInput natif
      />
      {/* Ternaire et pas &&, voir l'explication */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    alignSelf: "stretch", // Prend toute la largeur disponible
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
  },
});