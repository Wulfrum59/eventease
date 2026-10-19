// src/components/events/EventCard.tsx
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, opacity, radius, spacing } from "@/constants/theme";
import type { EventItem } from "@/types/event";
import { formatEventDate, isPastDate } from "@/utils/date";

type EventCardProps = {
  event: EventItem;
  isParticipating: boolean; // Calculé par le parent : la carte ne connaît pas l'utilisateur
  onPress: () => void;
};

export function EventCard({ event, isParticipating, onPress }: EventCardProps) {
  const isPast = isPastDate(event.date);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, isPast && styles.past, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        {isParticipating ? <Text style={styles.badge}>Je participe</Text> : null}
      </View>

      <Text style={styles.date}>
        {formatEventDate(event.date)}
        {isPast ? " · terminé" : ""}
      </Text>

      {/* numberOfLines : coupe le texte avec « ... » au-delà de 2 lignes */}
      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>

      <Text style={styles.participants}>
        {event.participantIds.length} participant(s)
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  past: {
    opacity: opacity.disabled, // Événement passé : visuellement atténué
  },
  pressed: {
    opacity: opacity.pressed,
  },
  header: {
    flexDirection: "row", // Titre et badge sur la même ligne
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1, // Le titre prend la place restante et laisse la sienne au badge
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
  },
  badge: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.onPrimary,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    overflow: "hidden", // Nécessaire pour que borderRadius s'applique au fond d'un Text
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "600",
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  participants: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});