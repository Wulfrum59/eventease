import { createContext, useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/hooks/useAuth";
import * as eventService from "@/services/eventService";
import type { EventInput } from "@/services/eventService";
import type { EventItem } from "@/types/event";

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
  async function createEvent(input: EventInput) {
    const created = await eventService.createEvent(input, requireUserId());
    await refresh();
    return created;
  }

  async function updateEvent(id: string, input: EventInput) {
    const updated = await eventService.updateEvent(id, input);
    await refresh();
    return updated;
  }

  async function deleteEvent(id: string) {
    await eventService.deleteEvent(id);
    await refresh();
  }

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