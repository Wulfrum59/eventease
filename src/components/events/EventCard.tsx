// Carte d'un événement dans la liste : bloc date à gauche, contenu à droite.
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DateBlock } from "@/components/events/DateBlock";
import {
  borderWidth,
  colors,
  fontSize,
  fontWeight,
  lineHeight,
  opacity,
  radius,
  spacing,
} from "@/constants/theme";
import type { EventItem } from "@/types/event";
import { getDateParts, isPastDate, isToday } from "@/utils/date";

type EventCardProps = {
  event: EventItem;
  isParticipating: boolean; // Calculé par le parent : la carte ne connaît pas l'utilisateur
  onPress: () => void;
};

export function EventCard({ event, isParticipating, onPress }: EventCardProps) {
  // Valeurs dérivées de l'événement, recalculées à chaque rendu
  const isPast = isPastDate(event.date);
  const isTodayEvent = isToday(event.date) && !isPast; // Le jour même, mais pas encore commencé
  const { time } = getDateParts(event.date);
  const count = event.participantIds.length;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      // style reçoit une fonction : React Native l'appelle avec l'état d'appui
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <DateBlock isoDate={event.date} isPast={isPast} isToday={isTodayEvent} />

      <View style={styles.content}>
        {/* Ligne du haut : heure + badges d'état */}
        <View style={styles.metaRow}>
          <Text style={[styles.time, isPast && styles.muted]}>{time}</Text>
          {isTodayEvent ? <Text style={[styles.tag, styles.tagToday]}>Aujourd'hui</Text> : null}
          {isPast ? <Text style={[styles.tag, styles.tagPast]}>Terminé</Text> : null}
          {isParticipating ? <Text style={[styles.tag, styles.tagJoined]}>✓ Je participe</Text> : null}
        </View>

        {/* numberOfLines : coupe le texte avec « ... » au-delà du nombre de lignes */}
        <Text style={[styles.title, isPast && styles.muted]} numberOfLines={1}>
          {event.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        <Text style={styles.participants}>
          {count} participant{count > 1 ? "s" : ""}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ----- Carte -----
  card: {
    flexDirection: "row", // Bloc date et contenu côte à côte
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    overflow: "hidden", // Le fond du bloc date suit les coins arrondis de la carte
  },
  pressed: {
    opacity: opacity.pressed,
  },
  content: {
    flex: 1, // Le contenu prend toute la place laissée par le bloc date
    padding: spacing.md,
    gap: spacing.xs,
  },

  // ----- Ligne heure + badges -----
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap", // Les badges passent à la ligne sur petit écran
    gap: spacing.sm,
  },
  time: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  tag: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
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

  // ----- Textes -----
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: lineHeight.sm,
  },
  participants: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  muted: {
    color: colors.textMuted,
  },
});
