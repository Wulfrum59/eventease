// Contexte des événements : une seule liste en mémoire, partagée par tous les écrans.
// Après chaque modification, la liste est relue : tous les écrans affichent la même version.
import { createContext, useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/hooks/useAuth";
import * as eventService from "@/services/eventService";
import type { EventInput } from "@/services/eventService";
import type { EventItem } from "@/types/event";

// Ce que le contexte met à disposition (lu via useEvents et useEventMutations)
type EventsContextValue = {
  events: EventItem[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  createEvent: (input: EventInput) => Promise<EventItem>;
  updateEvent: (id: string, input: EventInput) => Promise<EventItem>;
  deleteEvent: (id: string) => Promise<void>;
  toggleParticipation: (id: string) => Promise<void>;
};

export const EventsContext = createContext<EventsContextValue | null>(null);

type EventsProviderProps = {
  children: ReactNode;
};

// Composant qui détient la liste des événements et la fournit à tous ses enfants
export function EventsProvider({ children }: EventsProviderProps) {
  const { user } = useAuth(); // EventsProvider doit donc être placé DANS AuthProvider

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rafraîchissement silencieux après une mutation (pas d'indicateur de chargement)
  async function refresh() {
    setEvents(await eventService.getEvents());
  }

  // Chargement complet avec gestion du chargement et de l'erreur (démarrage, bouton « Réessayer »)
  async function reload() {
    setIsLoading(true);
    setError(null);
    try {
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de charger les événements.");
    } finally {
      setIsLoading(false);
    }
  }

  // Chargement initial au lancement de l'app
  useEffect(() => {
    reload();
    // Tableau vide volontaire : chargement UNE fois au montage.
    // Ajouter "reload" (recréée à chaque rendu) relancerait l'effet en boucle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Les écrans protégés garantissent un utilisateur connecté ; on vérifie quand même
  function requireUserId(): string {
    if (!user) throw new Error("Vous devez être connecté.");
    return user.id;
  }

  // Mutations : le service écrit, puis on relit la liste triée depuis le stockage.
  // Les erreurs remontent jusqu'à l'écran, qui les affiche.

  // Crée un événement au nom de l'utilisateur connecté
  async function createEvent(input: EventInput) {
    const created = await eventService.createEvent(input, requireUserId());
    await refresh();
    return created;
  }

  // Remplace le titre, la description et la date d'un événement existant
  async function updateEvent(id: string, input: EventInput) {
    const updated = await eventService.updateEvent(id, input);
    await refresh();
    return updated;
  }

  // Supprime définitivement un événement
  async function deleteEvent(id: string) {
    await eventService.deleteEvent(id);
    await refresh();
  }

  // Inscrit l'utilisateur connecté à l'événement, ou le désinscrit s'il l'était déjà
  async function toggleParticipation(id: string) {
    await eventService.toggleParticipation(id, requireUserId());
    await refresh();
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        isLoading,
        error,
        reload,
        createEvent,
        updateEvent,
        deleteEvent,
        toggleParticipation,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}