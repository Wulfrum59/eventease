// Tout ce qui touche aux événements : lire, créer, modifier, supprimer, participer.
// Les données passent toutes par storage.ts.
import { STORAGE_KEYS } from "@/constants/storageKeys"; // les clés de stockage
import { getItem, setItem } from "@/services/storage"; // lecture / écriture
import type { EventItem } from "@/types/event"; // le type d'un événement
import { generateId } from "@/utils/id"; // pour les ids

// Ce que l'utilisateur remplit dans le formulaire. Le reste (id, créateur, dates techniques), c'est nous qui gérons.
export type EventInput = Pick<EventItem, "title" | "description" | "date">;

// ----- Fonctions internes -----

// Lit tous les événements (liste vide au premier lancement)
async function readEvents(): Promise<EventItem[]> {
  return (await getItem<EventItem[]>(STORAGE_KEYS.events)) ?? []; // null → []
}

// Remplace toute la liste enregistrée par la nouvelle
async function writeEvents(events: EventItem[]): Promise<void> {
  await setItem(STORAGE_KEYS.events, events);
}

// Cherche un événement par son id, et lance une erreur s'il n'existe pas (sert à update et à la participation)
function findEventOrThrow(events: EventItem[], id: string): EventItem {
  const event = events.find((e) => e.id === id); // on cherche
  if (!event) throw new Error("Événement introuvable."); // pas trouvé
  return event; // trouvé
}

// ----- Fonctions utilisées par le reste de l'app -----

// Renvoie les événements triés, du plus proche au plus lointain
export async function getEvents(): Promise<EventItem[]> {
  const events = await readEvents(); // tout le stockage
  // Les dates ISO ont toutes le même format, donc l'ordre alphabétique = l'ordre chronologique.
  // [...events] fait une copie, parce que sort() modifie le tableau d'origine
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

// Crée un événement : on complète nous-mêmes l'id, le créateur et les dates
export async function createEvent(input: EventInput, userId: string): Promise<EventItem> {
  const events = await readEvents(); // la liste actuelle
  const now = new Date().toISOString(); // maintenant, en ISO

  const newEvent: EventItem = {
    id: generateId(), // nouvel id
    title: input.title.trim(), // titre sans espaces autour
    description: input.description.trim(), // pareil pour la description
    date: input.date, // la date choisie
    createdBy: userId, // qui l'a créé
    participantIds: [], // personne ne participe au début
    createdAt: now,
    updatedAt: now,
  };

  await writeEvents([...events, newEvent]); // ancienne liste + le nouveau
  return newEvent; // on le renvoie à l'appelant
}

// Modifie un événement qui existe déjà
export async function updateEvent(id: string, input: EventInput): Promise<EventItem> {
  const events = await readEvents(); // la liste actuelle
  const existing = findEventOrThrow(events, id); // l'événement à modifier

  // ...existing recopie tout, puis on écrase seulement les champs modifiés.
  // id, createdBy, participantIds et createdAt ne bougent pas.
  const updated: EventItem = {
    ...existing,
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date,
    updatedAt: new Date().toISOString(), // date de la modif
  };

  // map : on garde la même liste, sauf celui qu'on remplace par la nouvelle version
  await writeEvents(events.map((e) => (e.id === id ? updated : e)));
  return updated;
}

// Supprime un événement
export async function deleteEvent(id: string): Promise<void> {
  const events = await readEvents(); // la liste actuelle
  // filter : on garde tout sauf celui-là.
  // Si l'id n'existe pas, la liste reste pareille, pas besoin d'erreur : il n'est plus là de toute façon
  await writeEvents(events.filter((e) => e.id !== id));
}

// Ajoute l'utilisateur aux participants, ou le retire s'il y est déjà
export async function toggleParticipation(eventId: string, userId: string): Promise<EventItem> {
  const events = await readEvents(); // la liste actuelle
  const existing = findEventOrThrow(events, eventId); // l'événement concerné

  const isParticipating = existing.participantIds.includes(userId); // il participe déjà ?
  const updated: EventItem = {
    ...existing, // on recopie tout
    participantIds: isParticipating
      ? existing.participantIds.filter((id) => id !== userId) // oui : on le retire
      : [...existing.participantIds, userId], // non : on l'ajoute
  };

  await writeEvents(events.map((e) => (e.id === eventId ? updated : e))); // on remplace dans la liste
  return updated;
}
