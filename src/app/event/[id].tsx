import { router, Stack, useLocalSearchParams } from "expo-router"; // navigation + lecture de l'URL
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { DateBlock } from "@/components/events/DateBlock"; // le bloc jour / mois
import { ParticipationToggle } from "@/components/events/ParticipationToggle"; // bouton participer
import { Button } from "@/components/ui/Button"; // notre bouton
import { EmptyState } from "@/components/ui/EmptyState"; // l'écran "introuvable"
import {
  borderWidth,
  colors,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  spacing,
} from "@/constants/theme"; // thème
import { useAuth } from "@/hooks/useAuth"; // qui est connecté
import { useEventMutations } from "@/hooks/useEventMutations"; // supprimer / participer
import { useEvents } from "@/hooks/useEvents"; // la liste
import { formatEventDate, formatFullDay, getDateParts, isPastDate, isToday } from "@/utils/date"; // dates
import { capitalize } from "@/utils/text"; // majuscule au début

// Le détail d'un événement. L'id vient de l'URL : /event/abc-123 → id = "abc-123"
export default function EventDetailScreen() {
  // Tous les hooks en haut, avant les return (règle des hooks)
  const { id } = useLocalSearchParams<{ id: string }>(); // l'id dans l'URL
  const { user } = useAuth(); // la personne connectée
  const { events, isLoading } = useEvents(); // la liste
  const { deleteEvent, toggleParticipation } = useEventMutations(); // les actions

  // On va chercher l'événement dans le contexte, comme ça on a toujours la version à jour
  const event = events.find((e) => e.id === id);

  // Ça charge encore : on affiche une roue
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Id inconnu (événement supprimé, vieux lien...) : on affiche un message au lieu de planter
  if (!event) {
    return (
      <View style={styles.screen}>
        <EmptyState title="Événement introuvable" message="Il a peut-être été supprimé." />
      </View>
    );
  }

  // ----- Des infos qu'on calcule à partir de l'événement -----
  const isPast = isPastDate(event.date); // déjà passé ?
  const isTodayEvent = isToday(event.date) && !isPast; // aujourd'hui mais pas encore commencé
  const isCreator = event.createdBy === user?.id; // règle métier : seul le créateur peut modifier / supprimer
  const isParticipating = !!user && event.participantIds.includes(user.id); // la personne participe ?
  const { time } = getDateParts(event.date); // l'heure
  const count = event.participantIds.length; // nombre de participants

  // Demande confirmation avant de supprimer
  function confirmDelete(eventId: string, title: string) {
    Alert.alert(
      "Supprimer l'événement", // titre de la popup
      `« ${title} » sera définitivement supprimé. Cette action est irréversible.`, // message
      [
        { text: "Annuler", style: "cancel" }, // ferme juste la popup
        {
          text: "Supprimer",
          style: "destructive", // en rouge sur iOS (pas d'effet sur Android)
          onPress: async () => {
            // On quitte l'écran avant de supprimer : sinon, pendant une fraction de seconde,
            // le détail se réafficherait sans son événement et montrerait "introuvable"
            router.back();
            try {
              await deleteEvent(eventId); // suppression
            } catch (error) {
              // L'écran est fermé mais Alert s'affiche quand même par-dessus, donc l'erreur reste visible
              Alert.alert("Erreur", error instanceof Error ? error.message : "La suppression a échoué.");
            }
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Le titre du header devient le titre de l'événement */}
      <Stack.Screen options={{ title: event.title }} />

      {/* Les badges d'état, comme sur la carte de la liste (seulement s'il y en a au moins un) */}
      {isTodayEvent || isPast || isParticipating ? (
        <View style={styles.tags}>
          {isTodayEvent ? <Text style={[styles.tag, styles.tagToday]}>Aujourd'hui</Text> : null}
          {isPast ? <Text style={[styles.tag, styles.tagPast]}>Terminé</Text> : null}
          {isParticipating ? <Text style={[styles.tag, styles.tagJoined]}>✓ Je participe</Text> : null}
        </View>
      ) : null}

      <Text style={styles.title}>{event.title}</Text>

      {/* Carte façon agenda : bloc date à gauche, infos pratiques à droite */}
      <View style={styles.agendaCard}>
        <DateBlock isoDate={event.date} isPast={isPast} isToday={isTodayEvent} size="lg" />
        <View style={styles.agendaInfo}>
          {/* Ligne Date */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{capitalize(formatFullDay(event.date))}</Text>
          </View>
          <View style={styles.divider} />
          {/* Ligne Heure */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Heure</Text>
            <Text style={[styles.infoValue, styles.infoAccent]}>{time}</Text>
          </View>
          <View style={styles.divider} />
          {/* Ligne Participants, avec le s seulement au-dessus de 1 */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Participants</Text>
            <Text style={styles.infoValue}>
              {count} participant{count > 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      </View>

      {/* La description en entier */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>

      {/* Le bouton participer / annuler */}
      <ParticipationToggle
        isParticipating={isParticipating}
        isPast={isPast}
        onToggle={() => toggleParticipation(event.id)}
      />

      {/* Modifier et Supprimer, seulement pour le créateur */}
      {isCreator ? (
        <View style={styles.actions}>
          <View style={styles.actionItem}>
            <Button
              title="Modifier"
              onPress={() => router.push({ pathname: "/event/form", params: { id: event.id } })} // ouvre le formulaire en mode modif
            />
          </View>
          <View style={styles.actionItem}>
            <Button title="Supprimer" variant="danger" onPress={() => confirmDelete(event.id, event.title)} />
          </View>
        </View>
      ) : null}

      {/* Petite ligne en bas : qui l'a créé et quand */}
      <Text style={styles.meta}>
        {isCreator ? "Créé par vous" : "Créé par un autre membre"} · le {formatEventDate(event.createdAt)}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ----- L'écran -----
  screen: {
    flex: 1, // tout l'écran
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center", // roue centrée horizontalement
    justifyContent: "center", // et verticalement
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg, // marge autour
    paddingBottom: spacing.xl, // plus d'espace en bas
    gap: spacing.md, // espace entre les blocs
  },

  // ----- Les badges -----
  tags: {
    flexDirection: "row", // en ligne
    flexWrap: "wrap", // passent à la ligne si besoin
    gap: spacing.sm, // espace entre eux
  },
  tag: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    paddingHorizontal: spacing.ms, // air sur les côtés
    paddingVertical: spacing.xs, // un peu en haut et en bas
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

  title: {
    fontSize: fontSize.xl, // gros titre
    fontWeight: fontWeight.heavy, // très gras
    color: colors.text,
    lineHeight: lineHeight.xl, // hauteur de ligne adaptée si le titre fait 2 lignes
  },

  // ----- La carte agenda (bloc date + infos) -----
  agendaCard: {
    flexDirection: "row", // bloc date et infos côte à côte
    backgroundColor: colors.surface, // fond blanc
    borderRadius: radius.lg, // coins arrondis
    borderWidth: borderWidth.thin, // bordure fine
    borderColor: colors.border,
    overflow: "hidden", // le fond du bloc date suit les coins arrondis
  },
  agendaInfo: {
    flex: 1, // prend la place à côté du bloc date
    paddingHorizontal: spacing.md, // espace sur les côtés
    justifyContent: "center", // centré verticalement
  },
  infoRow: {
    paddingVertical: spacing.ms, // espace en haut et en bas de chaque ligne
    gap: spacing.xxs, // tout petit espace entre le libellé et la valeur
  },
  infoLabel: {
    fontSize: fontSize.xs, // petit
    fontWeight: fontWeight.bold,
    color: colors.textMuted, // gris
    textTransform: "uppercase", // majuscules
    letterSpacing: letterSpacing.md, // lettres espacées
  },
  infoValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  infoAccent: {
    color: colors.primary, // l'heure en indigo
  },
  divider: {
    height: StyleSheet.hairlineWidth, // le trait le plus fin possible
    backgroundColor: colors.border, // couleur du trait
  },

  // ----- La description -----
  section: {
    backgroundColor: colors.surface, // fond blanc
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    padding: spacing.md, // espace intérieur
    gap: spacing.sm, // espace entre titre et texte
  },
  sectionTitle: {
    fontSize: fontSize.xs, // petit
    fontWeight: fontWeight.bold,
    color: colors.textMuted, // gris
    textTransform: "uppercase", // majuscules
    letterSpacing: letterSpacing.md,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: lineHeight.md, // lignes aérées, plus facile à lire sur un long texte
  },

  // ----- Les boutons du créateur -----
  actions: {
    flexDirection: "row", // Modifier et Supprimer côte à côte
    gap: spacing.sm, // espace entre les deux
  },
  actionItem: {
    flex: 1, // les deux boutons font la même largeur
  },
  meta: {
    fontSize: fontSize.sm, // petit
    color: colors.textMuted, // gris
    textAlign: "center", // centré
    marginTop: spacing.sm, // un peu d'air au-dessus
  },
});
