// Petites fonctions sur les dates. Elles reçoivent toujours une date ISO (une chaîne)
// et affichent dans le fuseau du téléphone (les toLocale... utilisent l'heure locale).

// Date complète avec l'heure : "2026-11-01T10:00:00.000Z" → "dim. 1 novembre 2026 à 11:00"
export function formatEventDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("fr-FR", { // on transforme la chaîne en Date, puis en texte français
    weekday: "short", // jour en abrégé : "dim."
    day: "numeric", // numéro du jour : "1"
    month: "long", // mois en entier : "novembre"
    year: "numeric", // année : "2026"
    hour: "2-digit", // heure sur 2 chiffres
    minute: "2-digit", // minutes sur 2 chiffres
  });
}

// Découpe une date en morceaux pour le bloc façon agenda :
// { weekday: "dim", day: 1, month: "nov", time: "11:00" }
export function getDateParts(isoDate: string) {
  const date = new Date(isoDate); // on passe de la chaîne à un vrai objet Date
  return {
    // replace(".", "") vire le point des abréviations : "dim." → "dim"
    weekday: date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
    day: date.getDate(), // le numéro du jour dans le mois
    month: date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""), // mois abrégé
    time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), // "11:00"
  };
}

// Mois + année : "2026-11-01T10:00:00.000Z" → "novembre 2026" (les séparateurs de la liste)
export function formatMonthYear(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

// Le jour en toutes lettres, sans l'année : "mardi 20 octobre" (en haut de la liste)
export function formatLongDay(date: Date = new Date()): string { // par défaut : aujourd'hui
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

// Le jour complet sans l'heure : "2026-11-01T10:00:00.000Z" → "dimanche 1 novembre 2026"
export function formatFullDay(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    weekday: "long", // "dimanche"
    day: "numeric", // "1"
    month: "long", // "novembre"
    year: "numeric", // "2026"
  });
}

// Est-ce que les deux dates tombent dans le même mois de la même année ?
export function isSameMonth(isoA: string, isoB: string): boolean {
  const a = new Date(isoA); // première date
  const b = new Date(isoB); // deuxième date
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(); // même année ET même mois
}

// Est-ce que la date tombe aujourd'hui ? (on compare juste le jour, pas l'heure)
export function isToday(isoDate: string, now: Date = new Date()): boolean {
  return new Date(isoDate).toDateString() === now.toDateString(); // toDateString donne "Tue Oct 20 2026", sans l'heure
}

// Est-ce que la date est déjà passée ?
// "now" est un paramètre avec une valeur par défaut : comme ça on peut tester avec une date fixe
export function isPastDate(isoDate: string, now: Date = new Date()): boolean {
  return new Date(isoDate).getTime() < now.getTime(); // getTime = nombre de millisecondes, facile à comparer
}

// Date proposée par défaut dans le formulaire : demain à 18h (heure locale)
export function getDefaultEventDate(now: Date = new Date()): string {
  const date = new Date(now); // copie, pour ne pas toucher à "now"
  date.setDate(date.getDate() + 1); // +1 jour (si on est le 31, ça passe tout seul au 1er du mois suivant)
  date.setHours(18, 0, 0, 0); // 18h00 pile, secondes et millisecondes à zéro
  return date.toISOString(); // on renvoie une chaîne ISO, le format qu'on stocke
}
