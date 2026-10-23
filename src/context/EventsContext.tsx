// Contexte des événements : une seule liste en mémoire, partagée par tous les écrans.
// Après chaque modif on relit la liste, du coup tous les écrans voient la même version.
import { createContext, useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/hooks/useAuth"; // pour savoir qui est connecté
import * as eventService from "@/services/eventService"; // toutes les fonctions du service événements
import type { EventInput } from "@/services/eventService"; // les champs du formulaire
import type { EventItem } from "@/types/event"; // le type d'un événement

// Ce que le contexte donne aux écrans (lu via useEvents et useEventMutations)
type EventsContextValue = {
  events: EventItem[]; // la liste
  isLoading: boolean; // chargement en cours ?
  error: string | null; // message d'erreur, ou null si tout va bien
  reload: () => Promise<void>; // recharger la liste
  createEvent: (input: EventInput) => Promise<EventItem>; // créer
  updateEvent: (id: string, input: EventInput) => Promise<EventItem>; // modifier
  deleteEvent: (id: string) => Promise<void>; // supprimer
  toggleParticipation: (id: string) => Promise<void>; // participer / ne plus participer
};

// null par défaut = utilisé en dehors du Provider
export const EventsContext = createContext<EventsContextValue | null>(null);

// Les props du Provider
type EventsProviderProps = {
  children: ReactNode; // ce qu'on met entre les balises
};

// Le composant qui garde la liste des événements et la partage à tous ses enfants
export function EventsProvider({ children }: EventsProviderProps) {
  const { user } = useAuth(); // du coup EventsProvider doit être placé dans AuthProvider

  const [events, setEvents] = useState<EventItem[]>([]); // liste vide au départ
  const [isLoading, setIsLoading] = useState(true); // on charge dès le début
  const [error, setError] = useState<string | null>(null); // pas d'erreur au départ

  // Rafraîchit la liste en douce après une modif (pas de spinner)
  async function refresh() {
    setEvents(await eventService.getEvents()); // relit le stockage et met à jour la liste
  }

  // Chargement complet avec spinner et gestion d'erreur (au démarrage et sur le bouton "Réessayer")
  async function reload() {
    setIsLoading(true); // on affiche le spinner
    setError(null); // on efface l'ancienne erreur
    try {
      await refresh(); // on recharge
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de charger les événements."); // on garde le message
    } finally {
      setIsLoading(false); // fini, on enlève le spinner
    }
  }

  // Premier chargement quand l'app démarre
  useEffect(() => {
    reload();
    // Tableau vide exprès : on charge une seule fois au montage.
    // Si on mettait "reload" dedans (recréée à chaque rendu), l'effet tournerait en boucle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Les écrans sont protégés donc quelqu'un est forcément connecté, mais on vérifie quand même
  function requireUserId(): string {
    if (!user) throw new Error("Vous devez être connecté."); // pas connecté : erreur
    return user.id; // sinon on renvoie son id
  }

  // Pour chaque modif : le service écrit, puis on relit la liste triée.
  // Les erreurs remontent jusqu'à l'écran, qui les affiche.

  // Crée un événement au nom de la personne connectée
  async function createEvent(input: EventInput) {
    const created = await eventService.createEvent(input, requireUserId()); // écriture
    await refresh(); // on relit la liste
    return created; // on renvoie l'événement créé
  }

  // Modifie le titre, la description et la date d'un événement
  async function updateEvent(id: string, input: EventInput) {
    const updated = await eventService.updateEvent(id, input); // écriture
    await refresh(); // on relit
    return updated;
  }

  // Supprime un événement pour de bon
  async function deleteEvent(id: string) {
    await eventService.deleteEvent(id); // suppression
    await refresh(); // on relit
  }

  // Inscrit la personne connectée à l'événement, ou la désinscrit si elle l'était déjà
  async function toggleParticipation(id: string) {
    await eventService.toggleParticipation(id, requireUserId()); // écriture
    await refresh(); // on relit
  }

  return (
    // On partage tout ça à tous les composants enfants
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
