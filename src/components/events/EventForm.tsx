// Formulaire réutilisé pour la CRÉATION et la MODIFICATION d'un événement.
// Il ne sait pas ce qu'on fait des valeurs : c'est l'écran parent qui décide via onSubmit.
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { DateTimeField } from "@/components/ui/DateTimeField";
import { Input } from "@/components/ui/Input";
import { colors, fontWeight, lineHeight, radius, sizes, spacing } from "@/constants/theme";
import type { EventInput } from "@/services/eventService";
import { getDefaultEventDate } from "@/utils/date";
import { hasErrors, validateEventForm, type FieldErrors } from "@/utils/validation";

type EventFormProps = {
  initialValues?: EventInput; // Absent en création, rempli en modification
  submitLabel: string;
  onSubmit: (values: EventInput) => Promise<void>;
};

export function EventForm({ initialValues, submitLabel, onSubmit }: EventFormProps) {
  // ----- State du formulaire -----
  // ?. et ?? : si pas de valeurs initiales (création), on part de valeurs par défaut
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [date, setDate] = useState(initialValues?.date ?? getDefaultEventDate());

  const [errors, setErrors] = useState<FieldErrors<keyof EventInput>>({});
  const [submitError, setSubmitError] = useState<string | null>(null); // Erreur renvoyée par le parent
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valide les champs, puis transmet les valeurs au parent si tout est correct
  async function handleSubmit() {
    // Variable locale : "errors" ne sera à jour qu'au prochain rendu
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
      setIsSubmitting(false); // Exécuté dans tous les cas, succès ou erreur
    }
  }

  return (
    // Sur iOS, le clavier recouvre les champs : on remonte le contenu.
    // Sur Android, le système redimensionne déjà la fenêtre.
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* keyboardShouldPersistTaps : un appui sur le bouton fonctionne même clavier ouvert */}
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

        {submitError ? (
          <View style={styles.submitErrorBox}>
            <Text style={styles.submitError}>{submitError}</Text>
          </View>
        ) : null}

        <Button
          title={isSubmitting ? "Enregistrement..." : submitLabel}
          onPress={handleSubmit}
          disabled={isSubmitting} // Empêche le double envoi
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
    paddingBottom: spacing.xl,
    gap: spacing.lg, // Champs bien espacés : plus lisible qu'un formulaire tassé
  },
  description: {
    minHeight: sizes.textAreaMinHeight,
    lineHeight: lineHeight.md,
  },
  // Encadré rouge pâle pour l'erreur d'enregistrement
  submitErrorBox: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: spacing.ms,
  },
  submitError: {
    color: colors.danger,
    textAlign: "center",
    fontWeight: fontWeight.semibold,
  },
});
