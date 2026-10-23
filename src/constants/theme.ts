// Thème centralisé : toutes les valeurs visuelles de l'app sont définies ici.
// Style « agenda » : fond papier légèrement chaud, encre sombre, un accent indigo.
// "as const" fige les valeurs : TypeScript connaît la valeur exacte et interdit de la modifier.

// ----- Couleurs -----
export const colors = {
  primary: "#4F46E5", // Indigo : couleur d'accent (boutons, liens, jour courant)
  primarySoft: "#EEF0FF", // Fond léger associé à primary (blocs date, badges)
  onPrimary: "#FFFFFF", // Texte posé sur un fond primary
  background: "#F6F5F2", // Fond « papier » des écrans
  surface: "#FFFFFF", // Fond des cartes et des champs
  surfaceMuted: "#EFEEEA", // Fond atténué (événements passés)
  text: "#1C1B22",
  textMuted: "#6B6A75",
  border: "#E4E2DC",
  danger: "#D93F3F",
  dangerSoft: "#FDECEC",
  success: "#1F9D6B",
  successSoft: "#E6F6EF",
} as const;

// ----- Espacements (marges, paddings, gaps) -----
// Échelle fixe : on choisit dans cette liste au lieu d'inventer une valeur à chaque fois
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  ms: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// ----- Arrondis des coins -----
export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  pill: 999, // Valeur très grande : bords complètement arrondis (pilule, cercle)
} as const;

// ----- Typographie -----
export const fontSize = {
  xxs: 10,
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 32,
} as const;

// Hauteur d'une ligne de texte, associée aux tailles ci-dessus (plus lisible sur les textes longs)
export const lineHeight = {
  sm: 20,
  md: 24,
  xl: 32,
  xxl: 40,
} as const;

// Graisses de police : React Native attend une chaîne ("600"), pas un nombre
export const fontWeight = {
  semibold: "600",
  bold: "700",
  heavy: "800",
} as const;

// Espacement entre les lettres, pour les petits titres en majuscules
export const letterSpacing = {
  sm: 0.5,
  md: 0.8,
  lg: 1,
} as const;

// ----- Bordures -----
export const borderWidth = {
  thin: 1, // Contour des cartes et des champs
  thick: 4, // Anneau autour de l'avatar
} as const;

// ----- Dimensions fixes de certains éléments -----
export const sizes = {
  dateBlockSm: 48, // Mini bloc date du sélecteur de date
  dateBlockMd: 68, // Bloc date des cartes de la liste
  dateBlockLg: 84, // Bloc date de l'écran de détail
  avatar: 88,
  authIcon: 72, // Icône calendrier des écrans de connexion / inscription
  authIconBand: 20, // Bande colorée en haut de cette icône
  authIconRing: 6, // « Anneaux » de reliure de cette icône
  textAreaMinHeight: 120, // Hauteur minimale du champ description
} as const;

// ----- Opacités des états d'interaction (bouton appuyé, désactivé) -----
export const opacity = {
  pressed: 0.8,
  disabled: 0.5,
} as const;
