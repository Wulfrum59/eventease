// src/components/ui/DateTimeField.tsx
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { formatEventDate } from "@/utils/date";

type DateTimeFieldProps = {
  label: string;
  value: string; // Date ISO
  onChange: (isoDate: string) => void;
  error?: string;
};

export function DateTimeField({ label, value, onChange, error }: DateTimeFieldProps) {
  // Quel sélecteur est ouvert : la date, l'heure, ou aucun (null)
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);

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
      <Text style={[styles.value, error ? styles.valueError : null]}>{formatEventDate(value)}</Text>

      <View style={styles.actions}>
        <Pressable onPress={() => setPickerMode("date")} accessibilityRole="button">
          <Text style={styles.action}>Modifier la date</Text>
        </Pressable>
        <Pressable onPress={() => setPickerMode("time")} accessibilityRole="button">
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
    gap: spacing.xs,
    alignSelf: "stretch",
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.text,
  },
  value: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
  },
  valueError: {
    borderColor: colors.danger,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  action: {
    color: colors.primary,
    fontWeight: "600",
    paddingVertical: spacing.xs,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
  },
});