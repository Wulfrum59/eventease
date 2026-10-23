// Champ de saisie avec son libellé au-dessus et son message d'erreur en dessous
import { useState } from "react"; // pour retenir si le champ a le focus
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { borderWidth, colors, fontSize, fontWeight, letterSpacing, radius, spacing } from "@/constants/theme";

// Toutes les props normales d'un TextInput (value, onChangeText, secureTextEntry...) + les nôtres
type InputProps = TextInputProps & {
  label: string; // le libellé au-dessus
  error?: string; // message d'erreur, optionnel
};

// "...textInputProps" ramasse toutes les props qu'on n'a pas nommées juste avant
export function Input({ label, error, style, onFocus, onBlur, ...textInputProps }: InputProps) {
  // Juste pour le visuel : bordure indigo quand on est dans le champ
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        // le "style" du parent en dernier, comme ça il peut compléter ou remplacer le nôtre
        style={[styles.input, isFocused && styles.inputFocused, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textMuted} // couleur du texte d'exemple
        {...textInputProps} // on refile toutes les autres props au TextInput
        // Placés après le spread : on gère notre focus ET on appelle celui du parent s'il en a donné un
        onFocus={(e) => {
          setIsFocused(true); // on entre dans le champ
          onFocus?.(e); // ?.() : on l'appelle seulement s'il existe
        }}
        onBlur={(e) => {
          setIsFocused(false); // on sort du champ
          onBlur?.(e); // pareil, seulement s'il existe
        }}
      />
      {/* Ternaire plutôt que && : avec une chaîne vide, && afficherait "" hors d'un <Text> et ça planterait */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm, // espace entre libellé, champ et erreur
    alignSelf: "stretch", // prend toute la largeur
  },
  label: {
    fontSize: fontSize.xs, // petit
    fontWeight: fontWeight.bold, // gras
    color: colors.textMuted, // gris
    textTransform: "uppercase", // en majuscules
    letterSpacing: letterSpacing.md, // lettres un peu espacées
  },
  input: {
    backgroundColor: colors.surface, // fond blanc
    borderWidth: borderWidth.thin, // bordure fine
    borderColor: colors.border, // couleur de la bordure
    borderRadius: radius.md, // coins arrondis
    paddingHorizontal: spacing.md, // espace à gauche et à droite du texte
    paddingVertical: spacing.ms, // espace en haut et en bas
    fontSize: fontSize.md, // taille du texte tapé
    color: colors.text, // couleur du texte tapé
  },
  inputFocused: {
    borderColor: colors.primary, // bordure indigo quand on est dedans
  },
  inputError: {
    borderColor: colors.danger, // rouge en cas d'erreur (placé après, donc gagne sur le focus)
  },
  error: {
    fontSize: fontSize.sm, // petit
    color: colors.danger, // rouge
  },
});
