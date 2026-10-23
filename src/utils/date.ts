// Fonctions pures sur les dates. Les dates arrivent toujours en chaîne ISO (format de stockage),
// et sont affichées dans le fuseau horaire du téléphone (toLocale... utilise l'heure locale).

// Date complète avec l'heure : "2026-11-01T10:00:00.000Z" → "dim. 1 novembre 2026 à 11:00"
export function formatEventDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Découpe une date en morceaux pour l'affichage façon agenda :
// { weekday: "dim", day: 1, month: "nov", time: "11:00" }
export function getDateParts(isoDate: string) {
  const date = new Date(isoDate);
  return {
    // replace : retire le point des abréviations (« dim. » → « dim »)
    weekday: date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
    day: date.getDate(),
    month: date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
    time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
}

// Mois et année : "2026-11-01T10:00:00.000Z" → "novembre 2026" (titres de section de la liste)
export function formatMonthYear(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

// Jour en toutes lettres, sans l'année : "mardi 20 octobre" (en-tête de la liste)
export function formatLongDay(date: Date = new Date()): string {
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

// Jour complet sans l'heure : "2026-11-01T10:00:00.000Z" → "dimanche 1 novembre 2026"
export function formatFullDay(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Vrai si les deux dates tombent dans le même mois de la même année
export function isSameMonth(isoA: string, isoB: string): boolean {
  const a = new Date(isoA);
  const b = new Date(isoB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

// Vrai si la date tombe aujourd'hui (comparaison du jour seulement, sans l'heure)
export function isToday(isoDate: string, now: Date = new Date()): boolean {
  return new Date(isoDate).toDateString() === now.toDateString();
}

// Vrai si la date est déjà passée.
// "now" en paramètre (avec une valeur par défaut) : la fonction reste testable
// avec une date fixe, au lieu de dépendre de l'heure réelle
export function isPastDate(isoDate: string, now: Date = new Date()): boolean {
  return new Date(isoDate).getTime() < now.getTime();
}

// Date proposée par défaut dans le formulaire : demain à 18h (heure locale)
export function getDefaultEventDate(now: Date = new Date()): string {
  const date = new Date(now);
  date.setDate(date.getDate() + 1); // Gère seul le passage au mois suivant (31 → 1er)
  date.setHours(18, 0, 0, 0);
  return date.toISOString();
}
