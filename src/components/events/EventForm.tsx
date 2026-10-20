// src/components/events/EventForm.tsx
// Formulaire réutilisé pour la CRÉATION et la MODIFICATION d'un événement.
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";

import { Button } from "@/components/ui/Button";
import { DateTimeField } from "@/components/ui/DateTimeField";
import { Input } from "@/components/ui/Input";
import { colors, spacing } from "@/constants/theme";
import type { EventInput } from "@/services/eventService";
import { getDefaultEventDate } from "@/utils/date";
import { hasErrors, validateEventForm, type FieldErrors } from "@/utils/validation";

type EventFormProps = {
  initialValues?: EventInput; // Absent en création, rempli en modification
  submitLabel: string;
  onSubmit: (values: EventInput) => Promise<void>; // L'écran décide quoi faire des valeurs
};

export function EventForm({ initialValues, submitLabel, onSubmit }: EventFormProps) {
  // ?. et ?? : si pas de valeurs initiales (création), on part de valeurs par défaut
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [date, setDate] = useState(initialValues?.date ?? getDefaultEventDate());

  const [errors, setErrors] = useState<FieldErrors<keyof EventInput>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const validationErrors = validateEventForm({ title, description, date });
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ title, description, date });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Input
          label="Titre"
          value={title}
          onChangeText={setTitle}
          placeholder="Ex : Atelier photo"
          error={errors.title}
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="De quoi s'agit-il ?"
          multiline // Plusieurs lignes, retour à la ligne autorisé
          textAlignVertical="top" // Android : le texte commence en haut du champ
          style={styles.description}
          error={errors.description}
        />

        <DateTimeField label="Date et heure" value={date} onChange={setDate} error={errors.date} />

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

        <Button
          title={isSubmitting ? "Enregistrement..." : submitLabel}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  description: {
    minHeight: 100,
  },
  submitError: {
    color: colors.danger,
    textAlign: "center",
  },
});