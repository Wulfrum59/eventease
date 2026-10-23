// Met juste la première lettre en majuscule : "mardi 20 octobre" → "Mardi 20 octobre".
// textTransform: "capitalize" ne va pas, il mettrait une majuscule à chaque mot.
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1); // 1re lettre en majuscule + tout le reste tel quel
}
