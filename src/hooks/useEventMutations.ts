import { useContext } from "react"; // pour lire un contexte

import { EventsContext } from "@/context/EventsContext"; // le contexte des événements

// Hook d'écriture : créer, modifier, supprimer, participer
export function useEventMutations() {
  const context = useContext(EventsContext); // on lit le contexte
  if (!context) { // Provider oublié = bug de dev
    throw new Error("useEventMutations doit être utilisé à l'intérieur d'un EventsProvider.");
  }

  const { createEvent, updateEvent, deleteEvent, toggleParticipation } = context; // juste les fonctions qui modifient
  return { createEvent, updateEvent, deleteEvent, toggleParticipation };
}
