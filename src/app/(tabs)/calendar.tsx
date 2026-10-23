import { router } from "expo-router"; // pour changer d'écran
import { useState } from "react"; // pour retenir le jour sélectionné
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar, LocaleConfig, type CalendarProps } from "react-native-calendars"; // le calendrier + sa config de langue

import { EventCard } from "@/components/events/EventCard"; // la même carte que dans la liste
import { CALENDAR_LOCALE_FR } from "@/constants/calendarLocale"; // les textes français du calendrier
import { borderWidth, colors, fontSize, fontWeight, radius, spacing } from "@/constants/theme"; // thème
import { useAuth } from "@/hooks/useAuth"; // qui est connecté
import { useEvents } from "@/hooks/useEvents"; // la liste des événements
import { dateKeyToIso, formatFullDay, toLocalDateKey } from "@/utils/date"; // fonctions de date
import { capitalize } from "@/utils/text"; // majuscule au début

// On passe le calendrier en français. Fait une seule fois, au chargement du fichier, pas à chaque rendu
LocaleConfig.locales.fr = CALENDAR_LOCALE_FR; // on enregistre la langue "fr"
LocaleConfig.defaultLocale = "fr"; // et on la met par défaut

// Le type de l'objet des jours marqués, repris directement de la lib
type MarkedDates = NonNullable<CalendarProps["markedDates"]>;

// L'onglet Calendrier : les jours avec des événements ont un point, un appui sur un jour affiche ses événements
export default function CalendarScreen() {
  const { user } = useAuth(); // la personne connectée
  const { events, isLoading } = useEvents(); // la liste des événements

  // Le jour sélectionné, au format "AAAA-MM-JJ". Au départ : aujourd'hui
  const [selectedDay, setSelectedDay] = useState(() => toLocalDateKey(new Date().toISOString()));

  // Ça charge encore : on affiche une roue
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // On construit l'objet { "2026-11-01": { marked: true, ... } } attendu par le calendrier
  const markedDates: MarkedDates = {};
  for (const event of events) {
    markedDates[toLocalDateKey(event.date)] = { marked: true, dotColor: colors.primary }; // un point sous chaque jour qui a un événement
  }
  // Le jour sélectionné : rond indigo (le point passe en blanc grâce à selectedDotColor du theme plus bas)
  markedDates[selectedDay] = {
    ...markedDates[selectedDay], // on garde le point s'il y en avait un
    selected: true, // jour sélectionné
    selectedColor: colors.primary, // fond du rond
  };

  // Les événements du jour sélectionné (la liste est déjà triée par date, donc par heure)
  const dayEvents = events.filter((event) => toLocalDateKey(event.date) === selectedDay);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Le calendrier dans une carte blanche */}
      <View style={styles.calendarCard}>
        <Calendar
          current={selectedDay} // le mois affiché suit le jour sélectionné
          firstDay={1} // la semaine commence le lundi
          enableSwipeMonths // on peut glisser pour changer de mois
          markedDates={markedDates} // les jours avec un point + le jour sélectionné
          onDayPress={(day) => setSelectedDay(day.dateString)} // appui sur un jour : il devient le jour sélectionné
          // Les couleurs et tailles du calendrier, prises dans notre thème
          theme={{
            calendarBackground: colors.surface, // fond blanc
            monthTextColor: colors.text, // titre du mois
            textMonthFontSize: fontSize.lg, // taille du titre du mois
            textMonthFontWeight: fontWeight.bold, // titre du mois en gras
            arrowColor: colors.primary, // flèches mois précédent / suivant
            textSectionTitleColor: colors.textMuted, // "lun. mar. mer." en gris
            textDayHeaderFontSize: fontSize.xs, // taille de ces abréviations
            dayTextColor: colors.text, // les numéros des jours
            textDayFontSize: fontSize.md, // taille des numéros
            textDisabledColor: colors.border, // jours des mois d'à côté, très pâles
            todayTextColor: colors.primary, // aujourd'hui en indigo
            selectedDayBackgroundColor: colors.primary, // rond du jour sélectionné
            selectedDayTextColor: colors.onPrimary, // numéro blanc dans le rond
            dotColor: colors.primary, // couleur des points
            selectedDotColor: colors.onPrimary, // point blanc dans le rond
          }}
        />
      </View>

      {/* Le jour sélectionné écrit en entier */}
      <Text style={styles.dayTitle}>{capitalize(formatFullDay(dateKeyToIso(selectedDay)))}</Text>

      {/* Rien ce jour-là : petit message */}
      {dayEvents.length === 0 ? <Text style={styles.empty}>Aucun événement ce jour-là.</Text> : null}

      {/* Les événements du jour, avec la même carte que dans la liste */}
      {dayEvents.map((event) => (
        <EventCard
          key={event.id} // clé unique pour React
          event={event} // l'événement
          isParticipating={!!user && event.participantIds.includes(user.id)} // la personne connectée participe ?
          onPress={() => router.push({ pathname: "/event/[id]", params: { id: event.id } })} // ouvre le détail
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    padding: spacing.md, // marge autour
    paddingBottom: spacing.xl, // plus d'espace en bas
    gap: spacing.md, // espace entre le calendrier, le titre et les cartes
  },
  calendarCard: {
    backgroundColor: colors.surface, // fond blanc
    borderRadius: radius.lg, // coins arrondis
    borderWidth: borderWidth.thin, // bordure fine
    borderColor: colors.border,
    padding: spacing.sm, // un peu d'air autour du calendrier
    overflow: "hidden", // le calendrier suit les coins arrondis
  },
  dayTitle: {
    fontSize: fontSize.lg, // assez gros
    fontWeight: fontWeight.heavy, // très gras
    color: colors.text,
    marginTop: spacing.sm, // un peu d'air au-dessus
  },
  empty: {
    fontSize: fontSize.md,
    color: colors.textMuted, // gris
  },
});
