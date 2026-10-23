// Champ de formulaire pour choisir une date ET une heure.
// Deux tuiles appuyables ouvrent le sélecteur natif, l'une en mode date, l'autre en mode heure.
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
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
} from "@/constants/theme";
import { formatFullDay, getDateParts } from "@/utils/date";
import { capitalize } from "@/utils/text";

type DateTimeFieldProps = {
  label: string;
  value: string; // Date ISO
  onChange: (isoDate: string) => void;
  error?: string;
};

export function DateTimeField({ label, value, onChange, error }: DateTimeFieldProps) {
  // Quel sélecteur est ouvert : la date, l'heure, ou aucun (null)
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);

  const { weekday, day, month, time } = getDateParts(value);
  const fullDay = formatFullDay(value);

  // Appelée par le sélecteur natif quand l'utilisateur valide ou annule
  function handleChange(event: DateTimePickerEvent, selected?: Date) {
    // Android : on ferme d'abord, sinon le sélecteur peut se rouvrir au rendu suivant.
    // pickerMode garde ici son ANCIENNE valeur ("date" ou "time") jusqu'au prochain rendu.
    setPickerMode(null);

    // "dismissed" = l'utilisateur a annulé
    if (event.type !== "set" || !selected) return;

    const next = new Date(value);
    if (pickerMode === "date") {
      // On change le jour en gardant l'heure déjà choisie
      next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    } else {
      // On change l'heure en gardant le jour déjà choisi
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    }
    onChange(next.toISOString()); // On remonte une chaîne ISO, le format de stockage
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.tiles}>
        {/* Tuile date : mini page d'agenda + date en toutes lettres */}
        <Pressable
          onPress={() => setPickerMode("date")}
          accessibilityRole="button"
          accessibilityLabel={`Modifier la date, ${fullDay}`}
          style={({ pressed }) => [styles.tile, styles.dateTile, !!error && styles.tileError, pressed && styles.pressed]}
        >
          <View style={styles.miniBlock}>
            <Text style={styles.miniWeekday}>{weekday}</Text>
            <Text style={styles.miniDay}>{day}</Text>
            <Text style={styles.miniMonth}>{month}</Text>
          </View>
          <View style={styles.dateText}>
            <Text style={styles.value} numberOfLines={2}>
              {capitalize(fullDay)}
            </Text>
            <Text style={styles.action}>Modifier la date</Text>
          </View>
        </Pressable>

        {/* Tuile heure */}
        <Pressable
          onPress={() => setPickerMode("time")}
          accessibilityRole="button"
          accessibilityLabel={`Modifier l'heure, ${time}`}
          style={({ pressed }) => [styles.tile, styles.timeTile, !!error && styles.tileError, pressed && styles.pressed]}
        >
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.action}>Modifier l'heure</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Rendu conditionnel : sur Android, le composant s'affiche comme une boîte de dialogue */}
      {pickerMode ? (
        <DateTimePicker
          value={new Date(value)}
          mode={pickerMode}
          is24Hour // Format 24h pour l'heure
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    alignSelf: "stretch",
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: letterSpacing.md,
  },

  // ----- Tuiles appuyables -----
  tiles: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  tile: {
    backgroundColor: colors.surface,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.ms,
  },
  tileError: {
    borderColor: colors.danger,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  dateTile: {
    flex: 1.7, // La tuile date prend plus de place que la tuile heure
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.ms,
  },
  timeTile: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xxs,
  },

  // ----- Mini bloc date -----
  miniBlock: {
    width: sizes.dateBlockSm,
    alignItems: "center",
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  miniWeekday: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  miniDay: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    lineHeight: lineHeight.md, // Interligne serré : le bloc reste compact
  },
  miniMonth: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textTransform: "uppercase",
  },

  // ----- Textes -----
  dateText: {
    flex: 1,
    gap: spacing.xxs,
  },
  value: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  time: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.primary,
  },
  action: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
  },
});
