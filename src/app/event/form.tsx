// src/app/event/form.tsx
import { router, Stack } from "expo-router";

import { EventForm } from "@/components/events/EventForm";
import { useEventMutations } from "@/hooks/useEventMutations";
import type { EventInput } from "@/services/eventService";

export default function EventFormScreen() {
  const { createEvent } = useEventMutations();

  async function handleCreate(values: EventInput) {
    await createEvent(values); // En cas d'erreur, EventForm l'attrape et l'affiche
    router.back(); // Retour à la liste, déjà à jour grâce au refresh du contexte
  }

  return (
    <>
      {/* Configure le header de CET écran depuis l'écran lui-même */}
      <Stack.Screen options={{ title: "Nouvel événement" }} />
      <EventForm submitLabel="Créer l'événement" onSubmit={handleCreate} />
    </>
  );
}