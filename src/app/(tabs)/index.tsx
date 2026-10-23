import { router } from "expo-router"; // pour changer d'écran
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { EventCard } from "@/components/events/EventCard"; // la carte d'un événement
import { EmptyState } from "@/components/ui/EmptyState"; // l'écran "rien à afficher"
import { colors, fontSize, fontWeight, letterSpacing, spacing } from "@/constants/theme"; // thème
import { useAuth } from "@/hooks/useAuth"; // qui est connecté
import { useEvents } from "@/hooks/useEvents"; // la liste des événements
import { formatLongDay, formatMonthYear, isSameMonth } from "@/utils/date"; // fonctions de date
import { capitalize } from "@/utils/text"; // majuscule au début

// L'onglet Événements : la liste de tous les événements, triés par date
export default function EventsScreen() {
  const { user } = useAuth(); // la personne connectée
  const { events, isLoading, error, reload } = useEvents(); // la liste + son état

  // Cas 1 : ça charge, on affiche une roue
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Cas 2 : le stockage n'a pas pu être lu, on propose de réessayer
  if (error) {
    return (
      <View style={styles.screen}>
        <EmptyState title="Erreur" message={error} actionLabel="Réessayer" onAction={reload} />
      </View>
    );
  }

  // Cas 3 : la liste (ou le message "aucun événement", géré par la FlatList)
  // FlatList n'affiche que ce qui est visible à l'écran, donc ça reste fluide même avec beaucoup d'événements
  return (
    <FlatList
      style={styles.screen}
      data={events} // les données à afficher
      keyExtractor={(item) => item.id} // une clé unique par ligne, comme "key" en React web
      // Tout en haut de la liste : la date du jour, façon agenda
      ListHeaderComponent={
        <View style={styles.today}>
          <Text style={styles.todayLabel}>Aujourd'hui</Text>
          <Text style={styles.todayDate}>{capitalize(formatLongDay())}</Text>
        </View>
      }
      // Comment afficher chaque élément
      renderItem={({ item, index }) => {
        // La liste est triée par date, donc on affiche le nom du mois dès qu'il change
        const showMonth = index === 0 || !isSameMonth(item.date, events[index - 1].date);
        return (
          <View style={styles.item}>
            {/* Séparateur de mois : "NOVEMBRE 2026 ————" */}
            {showMonth ? (
              <View style={styles.monthRow}>
                <Text style={styles.monthLabel}>{formatMonthYear(item.date)}</Text>
                <View style={styles.monthLine} />
              </View>
            ) : null}
            <EventCard
              event={item} // l'événement
              isParticipating={!!user && item.participantIds.includes(user.id)} // la personne connectée participe ?
              onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id } })} // ouvre le détail
            />
          </View>
        );
      }}
      // Style du contenu : on ajoute emptyContent seulement quand la liste est vide
      contentContainerStyle={[styles.listContent, events.length === 0 && styles.emptyContent]}
      // Ce qui s'affiche à la place quand il n'y a aucun événement
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
  // ----- L'écran -----
  screen: {
    flex: 1, // tout l'écran
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1, // tout l'écran
    alignItems: "center", // roue centrée horizontalement
    justifyContent: "center", // et verticalement
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md, // marge autour de la liste
    paddingBottom: spacing.xl, // plus d'espace en bas
    gap: spacing.md, // espace entre les cartes
  },
  emptyContent: {
    flexGrow: 1, // liste vide : le contenu prend tout l'écran pour centrer le message
  },

  // ----- L'en-tête "Aujourd'hui" -----
  today: {
    paddingHorizontal: spacing.xs, // petit décalage sur les côtés
    paddingBottom: spacing.xs, // petit espace en dessous
  },
  todayLabel: {
    fontSize: fontSize.xs, // petit
    fontWeight: fontWeight.bold,
    color: colors.primary, // indigo
    textTransform: "uppercase", // majuscules
    letterSpacing: letterSpacing.lg, // lettres espacées
  },
  todayDate: {
    fontSize: fontSize.xl, // gros
    fontWeight: fontWeight.heavy, // très gras
    color: colors.text,
  },

  // ----- Un élément de la liste + le séparateur de mois -----
  item: {
    gap: spacing.sm, // espace entre le séparateur et la carte
  },
  monthRow: {
    flexDirection: "row", // texte et trait côte à côte
    alignItems: "center", // centrés verticalement
    gap: spacing.sm, // espace entre les deux
    marginTop: spacing.sm, // un peu d'air au-dessus
    paddingHorizontal: spacing.xs,
  },
  monthLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted, // gris
    textTransform: "uppercase", // majuscules
    letterSpacing: letterSpacing.lg, // lettres espacées
  },
  monthLine: {
    flex: 1, // le trait prend toute la largeur qui reste
    height: StyleSheet.hairlineWidth, // le trait le plus fin possible sur cet écran
    backgroundColor: colors.border, // couleur du trait
  },
});
