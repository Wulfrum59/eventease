// src/constants/theme.ts
// Thème centralisé : toutes les valeurs visuelles de l'app sont définies ici.

export const colors = {
  primary: "#208AEF", // Même bleu que le splash screen (app.json) pour la cohérence
  onPrimary: "#FFFFFF", // Texte posé sur un fond primary
  background: "#F5F7FA",
  surface: "#FFFFFF", // Fond des cartes et des champs
  text: "#1A1A1A",
  textMuted: "#6B7280",
  border: "#D1D5DB",
  danger: "#DC2626",
  success: "#16A34A",
} as const;

// Échelle d'espacements : on choisit dans cette liste au lieu d'inventer une valeur à chaque fois
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
} as const;

export const fontSize = {
  sm: 13,
  md: 16,
  lg: 20,
  xl: 26,
} as const;

// Opacités des états d'interaction (bouton appuyé, désactivé)
export const opacity = {
  pressed: 0.8,
  disabled: 0.5,
} as const;