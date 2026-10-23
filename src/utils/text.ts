// Fonctions pures sur le texte.

// Met la première lettre en majuscule : « mardi 20 octobre » → « Mardi 20 octobre ».
// On n'utilise pas textTransform: "capitalize", qui mettrait une majuscule à CHAQUE mot.
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
