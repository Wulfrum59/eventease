import { useContext } from "react";

import { EventsContext } from "@/context/EventsContext";

// Hook d'ÉCRITURE (mutation) : créer, modifier, supprimer, participer
export function useEventMutations() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEventMutations doit être utilisé à l'intérieur d'un EventsProvider.");
  }

  const { createEvent, updateEvent, deleteEvent, toggleParticipation } = context;
  return { createEvent, updateEvent, deleteEvent, toggleParticipation };
}