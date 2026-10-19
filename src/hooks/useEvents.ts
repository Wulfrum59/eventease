import { useContext } from "react";

import { EventsContext } from "@/context/EventsContext";

// Hook de LECTURE (query) : la liste et son état de chargement
export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents doit être utilisé à l'intérieur d'un EventsProvider.");
  }

  const { events, isLoading, error, reload } = context;
  return { events, isLoading, error, reload };
}