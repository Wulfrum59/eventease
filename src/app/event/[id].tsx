import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { DateBlock } from "@/components/events/DateBlock";
import { ParticipationToggle } from "@/components/events/ParticipationToggle";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  borderWidth,
  colors,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  spacing,
} from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEventMutations } from "@/hooks/useEventMutations";
import { useEvents } from "@/hooks/useEvents";
import { formatEventDate, formatFullDay, getDateParts, isPastDate, isToday } from "@/utils/date";
import { capitalize } from "@/utils/text";

// Écran de détail d'un événement. L'id vient de l'URL : /event/abc-123 → id = "abc-123"
export default function EventDetailScreen() {
  // Tous les hooks en haut, avant les return anticipés (règle des hooks)
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { events, isLoading } = useEvents();
  const { deleteEvent, toggleParticipation } = useEventMutations();

  // On cherche l'événement dans le contexte : toujours la version à jour
  const event = events.find((e) => e.id === id);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Id inconnu (événement supprimé, lien obsolète...) : on ne plante pas
  if (!event) {
    return (
      <View style={styles.screen}>
        <EmptyState title="Événement introuvable" message="Il a peut-être été supprimé." />
      </View>
    );
  }

  // ----- Valeurs dérivées de l'événement -----
  const isPast = isPastDate(event.date);
  const isTodayEvent = isToday(event.date) && !isPast; // Le jour même, mais pas encore commencé
  const isCreator = event.createdBy === user?.id; // Règle métier : seul le créateur modifie / supprime
  const isParticipating = !!user && event.participantIds.includes(user.id);
  const { time } = getDateParts(event.date);
  const count = event.participantIds.length;

  // Demande une confirmation avant de supprimer l'événement
  function confirmDelete(eventId: string, title: string) {
    Alert.alert(
      "Supprimer l'événement",
      `« ${title} » sera définitivement supprimé. Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" }, // Ferme simplement la boîte de dialogue
        {
          text: "Supprimer",
          style: "destructive", // Rouge sur iOS (sans effet visuel sur Android)
          onPress: async () => {
            // On quitte l'écran AVANT de supprimer : sinon, pendant un instant,
            // le détail se re-rendrait sans son événement et afficherait « introuvable »
            router.back();
            try {
              await deleteEvent(eventId);
            } catch (error) {
              // L'écran est fermé, mais Alert est global : l'erreur reste visible
              Alert.alert("Erreur", error instanceof Error ? error.message : "La suppression a échoué.");
            }
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Le titre du header devient celui de l'événement */}
      <Stack.Screen options={{ title: event.title }} />

      {/* Étiquettes d'état, comme sur la carte de la liste */}
      {isTodayEvent || isPast || isParticipating ? (
        <View style={styles.tags}>
          {isTodayEvent ? <Text style={[styles.tag, styles.tagToday]}>Aujourd'hui</Text> : null}
          {isPast ? <Text style={[styles.tag, styles.tagPast]}>Terminé</Text> : null}
          {isParticipating ? <Text style={[styles.tag, styles.tagJoined]}>✓ Je participe</Text> : null}
        </View>
      ) : null}

      <Text style={styles.title}>{event.title}</Text>

      {/* Entrée d'agenda : bloc date à gauche, infos pratiques à droite */}
      <View style={styles.agendaCard}>
        <DateBlock isoDate={event.date} isPast={isPast} isToday={isTodayEvent} size="lg" />
        <View style={styles.agendaInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{capitalize(formatFullDay(event.date))}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Heure</Text>
            <Text style={[styles.infoValue, styles.infoAccent]}>{time}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Participants</Text>
            <Text style={styles.infoValue}>
              {count} participant{count > 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Description complète */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>

      <ParticipationToggle
        isParticipating={isParticipating}
        isPast={isPast}
        onToggle={() => toggleParticipation(event.id)}
      />

      {/* Actions réservées au créateur de l'événement */}
      {isCreator ? (
        <View style={styles.actions}>
          <View style={styles.actionItem}>
            <Button
              title="Modifier"
              onPress={() => router.push({ pathname: "/event/form", params: { id: event.id } })}
            />
          </View>
          <View style={styles.actionItem}>
            <Button title="Supprimer" variant="danger" onPress={() => confirmDelete(event.id, event.title)} />
          </View>
        </View>
      ) : null}

      <Text style={styles.meta}>
        {isCreator ? "Créé par vous" : "Créé par un autre membre"} · le {formatEventDate(event.createdAt)}
      </Text>
    </ScrollView>
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
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },

  // ----- Étiquettes d'état -----
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    paddingHorizontal: spacing.ms,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    overflow: "hidden", // Nécessaire pour que borderRadius s'applique au fond d'un Text
  },
  tagToday: {
    color: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  tagPast: {
    color: colors.textMuted,
    backgroundColor: colors.surfaceMuted,
  },
  tagJoined: {
    color: colors.success,
    backgroundColor: colors.successSoft,
  },

  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    lineHeight: lineHeight.xl,
  },

  // ----- Carte agenda (bloc date + infos) -----
  agendaCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    overflow: "hidden", // Le fond du bloc date suit les coins arrondis
  },
  agendaInfo: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  infoRow: {
    paddingVertical: spacing.ms,
    gap: spacing.xxs,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.md,
  },
  infoValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  infoAccent: {
    color: colors.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth, // Trait le plus fin affichable par l'écran
    backgroundColor: colors.border,
  },

  // ----- Section description -----
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.md,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: lineHeight.md, // Interligne : plus lisible pour un texte long
  },

  // ----- Actions du créateur -----
  actions: {
    flexDirection: "row", // Modifier et Supprimer côte à côte
    gap: spacing.sm,
  },
  actionItem: {
    flex: 1, // Les deux boutons se partagent la largeur
  },
  meta: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
