// Le formulaire d'événement, utilisé pour la création ET la modification.
// Il ne sait pas quoi faire des valeurs : c'est l'écran parent qui décide, via onSubmit.
import { useState } from "react"; // pour retenir ce qui est tapé
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button"; // notre bouton
import { DateTimeField } from "@/components/ui/DateTimeField"; // le champ date + heure
import { Input } from "@/components/ui/Input"; // le champ texte
import { colors, fontWeight, lineHeight, radius, sizes, spacing } from "@/constants/theme"; // thème
import type { EventInput } from "@/services/eventService"; // les champs du formulaire
import { getDefaultEventDate } from "@/utils/date"; // date par défaut : demain 18h
import { hasErrors, validateEventForm, type FieldErrors } from "@/utils/validation"; // validation

// Les props acceptées
type EventFormProps = {
  initialValues?: EventInput; // vide en création, rempli en modification
  submitLabel: string; // le texte du bouton
  onSubmit: (values: EventInput) => Promise<void>; // ce que le parent fait des valeurs
};

export function EventForm({ initialValues, submitLabel, onSubmit }: EventFormProps) {
  // ----- Ce qui est tapé dans le formulaire -----
  // ?. et ?? : s'il n'y a pas de valeurs de départ (création), on prend des valeurs par défaut
  const [title, setTitle] = useState(initialValues?.title ?? ""); // titre
  const [description, setDescription] = useState(initialValues?.description ?? ""); // description
  const [date, setDate] = useState(initialValues?.date ?? getDefaultEventDate()); // date

  const [errors, setErrors] = useState<FieldErrors<keyof EventInput>>({}); // erreurs par champ
  const [submitError, setSubmitError] = useState<string | null>(null); // erreur renvoyée par le parent
  const [isSubmitting, setIsSubmitting] = useState(false); // envoi en cours ?

  // On vérifie les champs, puis on envoie les valeurs au parent si tout est bon
  async function handleSubmit() {
    // On met le résultat dans une variable locale : "errors" ne sera à jour qu'au prochain rendu
    const validationErrors = validateEventForm({ title, description, date });
    setErrors(validationErrors); // on affiche les erreurs sous les champs
    if (hasErrors(validationErrors)) return; // au moins une erreur : on s'arrête là

    setSubmitError(null); // on efface l'ancienne erreur
    setIsSubmitting(true); // le bouton passe en "Enregistrement..."
    try {
      await onSubmit({ title, description, date }); // le parent crée ou modifie
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue."); // on montre l'erreur
    } finally {
      setIsSubmitting(false); // dans tous les cas, on réactive le bouton
    }
  }

  return (
    // Sur iOS le clavier cache les champs, donc on remonte le contenu.
    // Sur Android le système redimensionne déjà la fenêtre, pas besoin.
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* keyboardShouldPersistTaps : on peut appuyer sur le bouton même avec le clavier ouvert */}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Champ titre */}
        <Input
          label="Titre"
          value={title} // ce qui est affiché
          onChangeText={setTitle} // à chaque lettre tapée on met à jour le state
          placeholder="Ex : Atelier photo" // texte d'exemple
          error={errors.title} // message d'erreur éventuel
        />

        {/* Champ description, sur plusieurs lignes */}
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="De quoi s'agit-il ?"
          multiline // plusieurs lignes, on peut faire entrée
          textAlignVertical="top" // sur Android, le texte commence en haut du champ
          style={styles.description} // hauteur mini
          error={errors.description}
        />

        {/* Champ date + heure */}
        <DateTimeField label="Date et heure" value={date} onChange={setDate} error={errors.date} />

        {/* Encadré d'erreur si l'enregistrement a raté */}
        {submitError ? (
          <View style={styles.submitErrorBox}>
            <Text style={styles.submitError}>{submitError}</Text>
          </View>
        ) : null}

        <Button
          title={isSubmitting ? "Enregistrement..." : submitLabel} // le texte change pendant l'envoi
          onPress={handleSubmit}
          disabled={isSubmitting} // pas de double envoi
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1, // prend tout l'écran
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg, // marge autour du formulaire
    paddingBottom: spacing.xl, // un peu plus en bas pour ne pas coller au bord
    gap: spacing.lg, // champs bien espacés, plus lisible
  },
  description: {
    minHeight: sizes.textAreaMinHeight, // hauteur mini du champ
    lineHeight: lineHeight.md, // lignes aérées
  },
  // Encadré rouge pâle pour l'erreur d'enregistrement
  submitErrorBox: {
    backgroundColor: colors.dangerSoft, // fond rose
    borderRadius: radius.md, // coins arrondis
    padding: spacing.ms, // espace intérieur
  },
  submitError: {
    color: colors.danger, // texte rouge
    textAlign: "center",
    fontWeight: fontWeight.semibold,
  },
});
