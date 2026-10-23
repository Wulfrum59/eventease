// La carte d'un événement dans la liste : bloc date à gauche, infos à droite
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DateBlock } from "@/components/events/DateBlock"; // le bloc jour / mois
import {
  borderWidth,
  colors,
  fontSize,
  fontWeight,
  lineHeight,
  opacity,
  radius,
  spacing,
} from "@/constants/theme"; // valeurs du thème
import type { EventItem } from "@/types/event"; // le type d'un événement
import { getDateParts, isPastDate, isToday } from "@/utils/date"; // fonctions de date

// Les props acceptées
type EventCardProps = {
  event: EventItem; // l'événement à afficher
  isParticipating: boolean; // calculé par le parent, la carte ne sait pas qui est connecté
  onPress: () => void; // ce qui se passe quand on appuie sur la carte
};

export function EventCard({ event, isParticipating, onPress }: EventCardProps) {
  // Des infos qu'on calcule à partir de l'événement, à chaque affichage
  const isPast = isPastDate(event.date); // déjà passé ?
  const isTodayEvent = isToday(event.date) && !isPast; // c'est aujourd'hui mais pas encore commencé
  const { time } = getDateParts(event.date); // l'heure, genre "18:00"
  const count = event.participantIds.length; // nombre de participants

  return (
    <Pressable
      onPress={onPress} // ouvre le détail
      accessibilityRole="button" // annoncé comme un bouton
      // style en fonction : React Native nous dit si on appuie dessus
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Le bloc date à gauche */}
      <DateBlock isoDate={event.date} isPast={isPast} isToday={isTodayEvent} />

      <View style={styles.content}>
        {/* Ligne du haut : l'heure + les badges */}
        <View style={styles.metaRow}>
          <Text style={[styles.time, isPast && styles.muted]}>{time}</Text>
          {isTodayEvent ? <Text style={[styles.tag, styles.tagToday]}>Aujourd'hui</Text> : null}
          {isPast ? <Text style={[styles.tag, styles.tagPast]}>Terminé</Text> : null}
          {isParticipating ? <Text style={[styles.tag, styles.tagJoined]}>✓ Je participe</Text> : null}
        </View>

        {/* numberOfLines coupe le texte avec "..." quand il dépasse */}
        <Text style={[styles.title, isPast && styles.muted]} numberOfLines={1}>
          {event.title}
        </Text>

        {/* La description, coupée à 2 lignes */}
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        {/* "1 participant" ou "3 participants" : on ajoute le s seulement au-dessus de 1 */}
        <Text style={styles.participants}>
          {count} participant{count > 1 ? "s" : ""}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ----- La carte -----
  card: {
    flexDirection: "row", // bloc date et contenu côte à côte
    backgroundColor: colors.surface, // fond blanc
    borderRadius: radius.lg, // coins arrondis
    borderWidth: borderWidth.thin, // bordure fine
    borderColor: colors.border,
    overflow: "hidden", // le fond du bloc date suit les coins arrondis
  },
  pressed: {
    opacity: opacity.pressed, // un peu transparent pendant l'appui
  },
  content: {
    flex: 1, // prend toute la place à côté du bloc date
    padding: spacing.md, // espace intérieur
    gap: spacing.xs, // petit espace entre les lignes
  },

  // ----- Ligne heure + badges -----
  metaRow: {
    flexDirection: "row", // en ligne
    alignItems: "center", // centrés verticalement
    flexWrap: "wrap", // les badges passent à la ligne si l'écran est trop petit
    gap: spacing.sm, // espace entre eux
  },
  time: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary, // l'heure en indigo
  },
  tag: {
    fontSize: fontSize.xs, // petit texte
    fontWeight: fontWeight.semibold,
    paddingHorizontal: spacing.sm, // un peu d'air sur les côtés
    paddingVertical: spacing.xxs, // très peu en haut et en bas
    borderRadius: radius.pill, // forme pilule
    overflow: "hidden", // sinon l'arrondi ne s'applique pas au fond d'un Text
  },
  tagToday: {
    color: colors.primary, // texte indigo
    backgroundColor: colors.primarySoft, // fond indigo clair
  },
  tagPast: {
    color: colors.textMuted, // texte gris
    backgroundColor: colors.surfaceMuted, // fond gris
  },
  tagJoined: {
    color: colors.success, // texte vert
    backgroundColor: colors.successSoft, // fond vert clair
  },

  // ----- Les textes -----
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold, // titre en gras
    color: colors.text,
  },
  description: {
    fontSize: fontSize.sm, // plus petit
    color: colors.textMuted, // gris
    lineHeight: lineHeight.sm, // lignes aérées
  },
  participants: {
    fontSize: fontSize.xs, // petit
    fontWeight: fontWeight.semibold,
    color: colors.textMuted, // gris
    marginTop: spacing.xs, // petit espace au-dessus
  },
  muted: {
    color: colors.textMuted, // gris pour un événement passé
  },
});
