// Tout le look de l'app est réglé ici : couleurs, tailles, espacements...
// Les composants piochent dedans, comme ça on change le style à un seul endroit.
// "as const" fige les valeurs : TypeScript connaît la valeur exacte et interdit de la modifier.

// ----- Couleurs -----
export const colors = {
  primary: "#4F46E5", // indigo, la couleur principale (boutons, liens, jour courant)
  primarySoft: "#EEF0FF", // version très claire de l'indigo, pour les fonds (blocs date, badges)
  onPrimary: "#FFFFFF", // texte posé sur du indigo : blanc
  background: "#F6F5F2", // fond des écrans, couleur papier un peu chaude
  surface: "#FFFFFF", // fond des cartes et des champs
  surfaceMuted: "#EFEEEA", // fond grisé pour les événements passés
  text: "#1C1B22", // couleur du texte normal
  textMuted: "#6B6A75", // texte secondaire, plus discret
  border: "#E4E2DC", // couleur des bordures
  danger: "#D93F3F", // rouge pour les erreurs et la suppression
  dangerSoft: "#FDECEC", // fond rose pâle qui va avec le rouge
  success: "#1F9D6B", // vert pour "je participe"
  successSoft: "#E6F6EF", // fond vert pâle qui va avec
} as const;

// ----- Espacements (marges, paddings, gaps) -----
// On prend toujours une valeur de cette liste plutôt que d'inventer un chiffre
export const spacing = {
  xxs: 2, // tout petit écart
  xs: 4,
  sm: 8,
  ms: 12, // entre sm et md
  md: 16,
  lg: 24,
  xl: 32, // gros espace
} as const;

// ----- Arrondis des coins -----
export const radius = {
  sm: 6, // léger arrondi
  md: 12, // arrondi des boutons et champs
  lg: 16, // arrondi des cartes
  pill: 999, // valeur énorme = bords complètement ronds (pilule ou cercle)
} as const;

// ----- Tailles de texte -----
export const fontSize = {
  xxs: 10, // minuscule (mini bloc date)
  xs: 11, // petits libellés
  sm: 13, // texte secondaire
  md: 16, // texte normal
  lg: 20, // titres de header
  xl: 26, // gros titres
  xxl: 32, // énorme (numéro du jour sur le détail)
} as const;

// Hauteur d'une ligne de texte, ça aère les textes longs
export const lineHeight = {
  sm: 20, // pour du texte en fontSize.sm
  md: 24, // pour du texte en fontSize.md
  xl: 32, // pour du texte en fontSize.xl
  xxl: 40, // pour du texte en fontSize.xxl
} as const;

// Épaisseur du texte : React Native veut une chaîne ("600"), pas un nombre
export const fontWeight = {
  semibold: "600", // un peu gras
  bold: "700", // gras
  heavy: "800", // très gras
} as const;

// Espace entre les lettres, pour les petits titres en majuscules
export const letterSpacing = {
  sm: 0.5,
  md: 0.8,
  lg: 1,
} as const;

// ----- Bordures -----
export const borderWidth = {
  thin: 1, // contour des cartes et des champs
  thick: 4, // l'anneau autour de l'avatar
} as const;

// ----- Tailles fixes de certains éléments -----
export const sizes = {
  dateBlockSm: 48, // mini bloc date dans le sélecteur de date
  dateBlockMd: 68, // bloc date des cartes de la liste
  dateBlockLg: 84, // bloc date de l'écran de détail
  avatar: 88, // rond avec les initiales sur le profil
  authIcon: 72, // icône calendrier sur connexion / inscription
  authIconBand: 20, // bande indigo en haut de cette icône
  authIconRing: 6, // les petits ronds (anneaux) de cette icône
  textAreaMinHeight: 120, // hauteur mini du champ description
} as const;

// ----- Transparence quand on appuie ou que c'est désactivé -----
export const opacity = {
  pressed: 0.8, // bouton qu'on est en train d'appuyer
  disabled: 0.5, // bouton désactivé
} as const;
