// Champ de formulaire pour choisir une date ET une heure.
// Deux tuiles : une ouvre le sélecteur de date du téléphone, l'autre celui de l'heure.
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker"; // sélecteur natif
import { useState } from "react"; // pour retenir quel sélecteur est ouvert
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  borderWidth,
  colors,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  opacity,
  radius,
  sizes,
  spacing,
} from "@/constants/theme"; // valeurs du thème
import { formatFullDay, getDateParts } from "@/utils/date"; // mise en forme des dates
import { capitalize } from "@/utils/text"; // majuscule au début

// Les props acceptées
type DateTimeFieldProps = {
  label: string; // libellé au-dessus
  value: string; // la date actuelle, en ISO
  onChange: (isoDate: string) => void; // appelée avec la nouvelle date
  error?: string; // message d'erreur, optionnel
};

export function DateTimeField({ label, value, onChange, error }: DateTimeFieldProps) {
  // Quel sélecteur est ouvert : "date", "time", ou aucun (null)
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);

  const { weekday, day, month, time } = getDateParts(value); // les morceaux pour l'affichage
  const fullDay = formatFullDay(value); // la date en toutes lettres

  // Appelée par le sélecteur quand la personne valide ou annule
  function handleChange(event: DateTimePickerEvent, selected?: Date) {
    // Sur Android il faut fermer d'abord, sinon le sélecteur peut se rouvrir au rendu suivant.
    // Attention, pickerMode garde ici son ancienne valeur ("date" ou "time") jusqu'au prochain rendu.
    setPickerMode(null);

    // type différent de "set" = la personne a annulé, on ne touche à rien
    if (event.type !== "set" || !selected) return;

    const next = new Date(value); // on part de la date actuelle
    if (pickerMode === "date") {
      // On change le jour mais on garde l'heure déjà choisie
      next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    } else {
      // On change l'heure mais on garde le jour déjà choisi
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    }
    onChange(next.toISOString()); // on renvoie une chaîne ISO au parent, c'est le format qu'on stocke
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.tiles}>
        {/* Tuile date : mini page d'agenda + la date écrite en entier */}
        <Pressable
          onPress={() => setPickerMode("date")} // ouvre le sélecteur de date
          accessibilityRole="button" // annoncé comme un bouton
          accessibilityLabel={`Modifier la date, ${fullDay}`} // ce que lit le lecteur d'écran
          // bordure rouge si erreur, transparence pendant l'appui
          style={({ pressed }) => [styles.tile, styles.dateTile, !!error && styles.tileError, pressed && styles.pressed]}
        >
          {/* Le mini bloc jour / numéro / mois */}
          <View style={styles.miniBlock}>
            <Text style={styles.miniWeekday}>{weekday}</Text>
            <Text style={styles.miniDay}>{day}</Text>
            <Text style={styles.miniMonth}>{month}</Text>
          </View>
          {/* La date en toutes lettres + l'indication */}
          <View style={styles.dateText}>
            <Text style={styles.value} numberOfLines={2}>
              {capitalize(fullDay)}
            </Text>
            <Text style={styles.action}>Modifier la date</Text>
          </View>
        </Pressable>

        {/* Tuile heure */}
        <Pressable
          onPress={() => setPickerMode("time")} // ouvre le sélecteur d'heure
          accessibilityRole="button"
          accessibilityLabel={`Modifier l'heure, ${time}`}
          style={({ pressed }) => [styles.tile, styles.timeTile, !!error && styles.tileError, pressed && styles.pressed]}
        >
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.action}>Modifier l'heure</Text>
        </Pressable>
      </View>

      {/* Le message d'erreur s'il y en a un */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Le sélecteur n'existe que quand il est ouvert. Sur Android il s'affiche en popup */}
      {pickerMode ? (
        <DateTimePicker
          value={new Date(value)} // la date de départ
          mode={pickerMode} // "date" ou "time"
          is24Hour // heure au format 24h
          onChange={handleChange} // appelé quand on valide ou annule
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm, // espace entre libellé, tuiles et erreur
    alignSelf: "stretch", // toute la largeur
  },
  label: {
    fontSize: fontSize.xs, // petit
    fontWeight: fontWeight.bold, // gras
    color: colors.textMuted, // gris
    textTransform: "uppercase", // majuscules
    letterSpacing: letterSpacing.md, // lettres espacées
  },

  // ----- Les tuiles -----
  tiles: {
    flexDirection: "row", // les deux tuiles côte à côte
    gap: spacing.sm, // espace entre elles
  },
  tile: {
    backgroundColor: colors.surface, // fond blanc
    borderWidth: borderWidth.thin, // bordure fine
    borderColor: colors.border,
    borderRadius: radius.md, // coins arrondis
    padding: spacing.ms, // espace intérieur
  },
  tileError: {
    borderColor: colors.danger, // bordure rouge en cas d'erreur
  },
  pressed: {
    opacity: opacity.pressed, // transparence pendant l'appui
  },
  dateTile: {
    flex: 1.7, // la tuile date est plus large que celle de l'heure
    flexDirection: "row", // mini bloc et texte côte à côte
    alignItems: "center", // centrés verticalement
    gap: spacing.ms, // espace entre les deux
  },
  timeTile: {
    flex: 1, // prend le reste de la largeur
    alignItems: "center", // contenu centré
    justifyContent: "center",
    gap: spacing.xxs, // tout petit espace entre l'heure et le texte
  },

  // ----- Le mini bloc date -----
  miniBlock: {
    width: sizes.dateBlockSm, // largeur fixe
    alignItems: "center", // textes centrés
    paddingVertical: spacing.xs, // un peu d'air en haut et en bas
    borderRadius: radius.sm, // léger arrondi
    backgroundColor: colors.primarySoft, // fond indigo clair
  },
  miniWeekday: {
    fontSize: fontSize.xxs, // tout petit
    fontWeight: fontWeight.semibold,
    color: colors.textMuted, // gris
    textTransform: "uppercase", // majuscules
  },
  miniDay: {
    fontSize: fontSize.lg, // le numéro en plus gros
    fontWeight: fontWeight.heavy, // très gras
    color: colors.text,
    lineHeight: lineHeight.md, // ligne serrée pour que le bloc reste compact
  },
  miniMonth: {
    fontSize: fontSize.xxs, // tout petit
    fontWeight: fontWeight.bold,
    color: colors.primary, // indigo
    textTransform: "uppercase",
  },

  // ----- Les textes -----
  dateText: {
    flex: 1, // prend la place restante à côté du mini bloc
    gap: spacing.xxs, // petit espace entre les deux lignes
  },
  value: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  time: {
    fontSize: fontSize.xl, // l'heure en gros
    fontWeight: fontWeight.heavy,
    color: colors.primary, // indigo
  },
  action: {
    fontSize: fontSize.xs, // petit
    color: colors.primary, // indigo, ça fait lien
    fontWeight: fontWeight.semibold,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger, // rouge
  },
});
