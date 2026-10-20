// src/app/event/form.tsx
// Un écran, deux modes : création (/event/form) ou modification (/event/form?id=xxx)
import { router, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

import { EventForm } from "@/components/events/EventForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { colors } from "@/constants/theme";
import { useEventMutations } from "@/hooks/useEventMutations";
import { useEvents } from "@/hooks/useEvents";
import type { EventInput } from "@/services/eventService";

export default function EventFormScreen() {
  // TOUS les hooks d'abord, avant tout return (règle des hooks)
  const { id } = useLocalSearchParams<{ id?: string }>(); // id optionnel
  const { events } = useEvents();
  const { createEvent, updateEvent } = useEventMutations();

  const isEditMode = id !== undefined;
  const eventToEdit = isEditMode ? events.find((e) => e.id === id) : undefined;

  // Modification demandée, mais événement introuvable (supprimé entre-temps...)
  if (isEditMode && !eventToEdit) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: "Modifier l'événement" }} />
        <EmptyState title="Événement introuvable" message="Il a peut-être été supprimé." />
      </View>
    );
  }

  async function handleSubmit(values: EventInput) {
    if (eventToEdit) {
      await updateEvent(eventToEdit.id, values);
    } else {
      await createEvent(values);
    }
    router.back(); // Retour à l'écran précédent (détail ou liste), déjà à jour
  }

  return (
    <>
      <Stack.Screen options={{ title: eventToEdit ? "Modifier l'événement" : "Nouvel événement" }} />
      <EventForm
        // Un EventItem contient tous les champs d'un EventInput : TypeScript l'accepte
        initialValues={eventToEdit}
        submitLabel={eventToEdit ? "Enregistrer les modifications" : "Créer l'événement"}
        onSubmit={handleSubmit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});