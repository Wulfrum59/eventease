import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { EventCard } from "@/components/events/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { colors, fontSize, fontWeight, letterSpacing, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { formatLongDay, formatMonthYear, isSameMonth } from "@/utils/date";
import { capitalize } from "@/utils/text";

// Onglet « Événements » : liste de tous les événements, triés par date
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
  // FlatList n'affiche que les éléments visibles à l'écran : performant même avec une longue liste
  return (
    <FlatList
      style={styles.screen}
      data={events}
      keyExtractor={(item) => item.id} // Clé unique, comme "key" en React web
      // En-tête façon agenda : la date du jour
      ListHeaderComponent={
        <View style={styles.today}>
          <Text style={styles.todayLabel}>Aujourd'hui</Text>
          <Text style={styles.todayDate}>{capitalize(formatLongDay())}</Text>
        </View>
      }
      // Rendu d'un élément de la liste
      renderItem={({ item, index }) => {
        // Les événements sont triés par date : on affiche le mois dès qu'il change
        const showMonth = index === 0 || !isSameMonth(item.date, events[index - 1].date);
        return (
          <View style={styles.item}>
            {showMonth ? (
              <View style={styles.monthRow}>
                <Text style={styles.monthLabel}>{formatMonthYear(item.date)}</Text>
                <View style={styles.monthLine} />
              </View>
            ) : null}
            <EventCard
              event={item}
              isParticipating={!!user && item.participantIds.includes(user.id)}
              onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id } })}
            />
          </View>
        );
      }}
      contentContainerStyle={[styles.listContent, events.length === 0 && styles.emptyContent]}
      // Affiché à la place de la liste quand elle est vide
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
  // ----- Écran -----
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
    paddingBottom: spacing.xl,
    gap: spacing.md, // Espace entre les cartes
  },
  emptyContent: {
    flexGrow: 1, // Liste vide : le contenu remplit l'écran pour centrer l'EmptyState
  },

  // ----- En-tête « Aujourd'hui » -----
  today: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
  todayLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.lg,
  },
  todayDate: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },

  // ----- Élément de liste + séparateur de mois -----
  item: {
    gap: spacing.sm,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  monthLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.lg,
  },
  monthLine: {
    flex: 1, // Trait horizontal qui prolonge le titre du mois
    height: StyleSheet.hairlineWidth, // Trait le plus fin affichable par l'écran
    backgroundColor: colors.border,
  },
});
