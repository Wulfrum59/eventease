// Un seul écran pour deux usages : création (/event/form) ou modification (/event/form?id=xxx)
import { router, Stack, useLocalSearchParams } from "expo-router"; // navigation + lecture de l'URL
import { StyleSheet, View } from "react-native";

import { EventForm } from "@/components/events/EventForm"; // le formulaire
import { EmptyState } from "@/components/ui/EmptyState"; // l'écran "introuvable"
import { colors } from "@/constants/theme"; // thème
import { useEventMutations } from "@/hooks/useEventMutations"; // créer / modifier
import { useEvents } from "@/hooks/useEvents"; // la liste
import type { EventInput } from "@/services/eventService"; // les champs du formulaire

// L'écran qui affiche EventForm et décide quoi faire des valeurs (créer ou modifier)
export default function EventFormScreen() {
  // Tous les hooks d'abord, avant n'importe quel return (règle des hooks)
  const { id } = useLocalSearchParams<{ id?: string }>(); // l'id dans l'URL, s'il y en a un
  const { events } = useEvents(); // la liste des événements
  const { createEvent, updateEvent } = useEventMutations(); // les fonctions d'écriture

  const isEditMode = id !== undefined; // un id = on modifie, pas d'id = on crée
  const eventToEdit = isEditMode ? events.find((e) => e.id === id) : undefined; // l'événement à modifier

  // On veut modifier, mais l'événement n'existe plus (supprimé entre-temps par ex.)
  if (isEditMode && !eventToEdit) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: "Modifier l'événement" }} />
        <EmptyState title="Événement introuvable" message="Il a peut-être été supprimé." />
      </View>
    );
  }

  // Appelée par EventForm une fois les champs validés.
  // On n'attrape pas les erreurs ici : EventForm les affiche lui-même sous le formulaire.
  async function handleSubmit(values: EventInput) {
    if (eventToEdit) {
      await updateEvent(eventToEdit.id, values); // modification
    } else {
      await createEvent(values); // création
    }
    router.back(); // retour à l'écran d'avant (détail ou liste), qui est déjà à jour
  }

  return (
    <>
      {/* Le titre du header change selon le mode */}
      <Stack.Screen options={{ title: eventToEdit ? "Modifier l'événement" : "Nouvel événement" }} />
      <EventForm
        // Un EventItem a tous les champs d'un EventInput, donc TypeScript l'accepte
        initialValues={eventToEdit}
        submitLabel={eventToEdit ? "Enregistrer les modifications" : "Créer l'événement"} // texte du bouton
        onSubmit={handleSubmit} // ce qui se passe à la validation
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // tout l'écran
    backgroundColor: colors.background,
  },
});
