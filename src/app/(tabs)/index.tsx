// src/app/(tabs)/index.tsx
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { EventCard } from "@/components/events/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";

export default function EventsScreen() {
  const { user } = useAuth();
  const { events, isLoading, error, reload } = useEvents();

  // État 1 : chargement
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // État 2 : erreur de lecture du stockage, avec possibilité de réessayer
  if (error) {
    return (
      <View style={styles.screen}>
        <EmptyState title="Erreur" message={error} actionLabel="Réessayer" onAction={reload} />
      </View>
    );
  }

  // État 3 : la liste (ou l'état vide géré par FlatList)
  return (
    <FlatList
      style={styles.screen}
      data={events}
      keyExtractor={(item) => item.id} // Clé unique, comme "key" en React web
      renderItem={({ item }) => (
        <EventCard
          event={item}
          isParticipating={!!user && item.participantIds.includes(user.id)}
          // Navigation vers le détail ajoutée à l'étape 2.5
          onPress={() => console.log("Détail de :", item.title)}
        />
      )}
      contentContainerStyle={[styles.listContent, events.length === 0 && styles.emptyContent]}
      ListEmptyComponent={
        <EmptyState
          title="Aucun événement"
          message="Les événements de l'association apparaîtront ici."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md, // Espace entre les cartes
  },
  emptyContent: {
    flexGrow: 1, // Liste vide : le contenu remplit l'écran pour centrer l'EmptyState
  },
});