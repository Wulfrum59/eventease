import { useContext } from "react"; // pour lire un contexte

import { EventsContext } from "@/context/EventsContext"; // le contexte des événements

// Hook de lecture : la liste et son état de chargement
export function useEvents() {
  const context = useContext(EventsContext); // on lit le contexte
  if (!context) { // Provider oublié = bug de dev
    throw new Error("useEvents doit être utilisé à l'intérieur d'un EventsProvider.");
  }

  const { events, isLoading, error, reload } = context; // on garde juste ce qui sert à lire
  return { events, isLoading, error, reload };
}
