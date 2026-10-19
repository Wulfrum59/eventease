// CRUD des événements + participation. Toutes les données passent par storage.ts.
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getItem, setItem } from "@/services/storage";
import type { EventItem } from "@/types/event";
import { generateId } from "@/utils/id";

// Ce que l'utilisateur saisit dans le formulaire. Le reste (id, dates techniques...) est géré ici.
export type EventInput = Pick<EventItem, "title" | "description" | "date">;

// ----- Fonctions internes -----

async function readEvents(): Promise<EventItem[]> {
  return (await getItem<EventItem[]>(STORAGE_KEYS.events)) ?? [];
}

async function writeEvents(events: EventItem[]): Promise<void> {
  await setItem(STORAGE_KEYS.events, events);
}

// Factorise la recherche + l'erreur, utilisée par update et toggleParticipation
function findEventOrThrow(events: EventItem[], id: string): EventItem {
  const event = events.find((e) => e.id === id);
  if (!event) throw new Error("Événement introuvable.");
  return event;
}

// ----- API publique -----

// Retourne les événements triés du plus proche au plus lointain
export async function getEvents(): Promise<EventItem[]> {
  const events = await readEvents();
  // Les dates ISO ont toutes le même format : l'ordre alphabétique = l'ordre chronologique.
  // [...events] : sort() modifie le tableau sur place, on trie donc une copie
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

export async function createEvent(input: EventInput, userId: string): Promise<EventItem> {
  const events = await readEvents();
  const now = new Date().toISOString();

  const newEvent: EventItem = {
    id: generateId(),
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date,
    createdBy: userId,
    participantIds: [],
    createdAt: now,
    updatedAt: now,
  };

  await writeEvents([...events, newEvent]);
  return newEvent;
}

export async function updateEvent(id: string, input: EventInput): Promise<EventItem> {
  const events = await readEvents();
  const existing = findEventOrThrow(events, id);

  // Spread : copie de l'existant, puis on écrase uniquement les champs modifiés.
  // id, createdBy, participantIds et createdAt sont conservés tels quels.
  const updated: EventItem = {
    ...existing,
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date,
    updatedAt: new Date().toISOString(),
  };

  // map : même liste, sauf l'élément ciblé qui est remplacé
  await writeEvents(events.map((e) => (e.id === id ? updated : e)));
  return updated;
}

export async function deleteEvent(id: string): Promise<void> {
  const events = await readEvents();
  // filter : on garde tout sauf l'événement supprimé.
  // Si l'id n'existe pas, la liste est inchangée (pas d'erreur : le résultat voulu est atteint)
  await writeEvents(events.filter((e) => e.id !== id));
}

// Ajoute l'utilisateur aux participants, ou le retire s'il y est déjà
export async function toggleParticipation(eventId: string, userId: string): Promise<EventItem> {
  const events = await readEvents();
  const existing = findEventOrThrow(events, eventId);

  const isParticipating = existing.participantIds.includes(userId);
  const updated: EventItem = {
    ...existing,
    participantIds: isParticipating
      ? existing.participantIds.filter((id) => id !== userId) // Retrait
      : [...existing.participantIds, userId], // Ajout
  };

  await writeEvents(events.map((e) => (e.id === eventId ? updated : e)));
  return updated;
}