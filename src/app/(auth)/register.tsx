import { useState } from "react"; // pour retenir ce qui est tapé
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { AuthHeader } from "@/components/ui/AuthHeader"; // icône + titre
import { Button } from "@/components/ui/Button"; // notre bouton
import { Input } from "@/components/ui/Input"; // notre champ texte
import { borderWidth, colors, fontSize, fontWeight, lineHeight, radius, spacing } from "@/constants/theme"; // thème
import { useAuth } from "@/hooks/useAuth"; // pour s'inscrire
import { hasErrors, validateRegisterForm, type FieldErrors } from "@/utils/validation"; // validation

// Les noms des champs du formulaire
type RegisterField = "name" | "email" | "password" | "confirmPassword";

// L'écran d'inscription
export default function RegisterScreen() {
  const { register } = useAuth(); // la fonction d'inscription du contexte

  // ----- Ce qui est tapé dans le formulaire -----
  // Formulaire contrôlé : une variable de state par champ
  const [name, setName] = useState(""); // nom
  const [email, setEmail] = useState(""); // email
  const [password, setPassword] = useState(""); // mot de passe
  const [confirmPassword, setConfirmPassword] = useState(""); // confirmation

  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({}); // erreurs par champ
  const [submitError, setSubmitError] = useState<string | null>(null); // erreur renvoyée par le service
  const [isSubmitting, setIsSubmitting] = useState(false); // création en cours ?

  // On vérifie le formulaire, puis on crée le compte
  async function handleSubmit() {
    // Variable locale : "errors" ne sera à jour qu'au prochain rendu
    const validationErrors = validateRegisterForm({ name, email, password, confirmPassword });
    setErrors(validationErrors); // on affiche les erreurs
    if (hasErrors(validationErrors)) return; // une erreur = on s'arrête

    setSubmitError(null); // on efface l'ancienne erreur
    setIsSubmitting(true); // le bouton passe en "Création..."
    try {
      // On n'envoie pas confirmPassword : il sert juste à vérifier le formulaire
      await register({ name, email, password });
      // Pas de router.push : le contexte met user à jour et le layout bascule sur les onglets
    } catch (error) {
      // Par exemple "Un compte existe déjà avec cet email."
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false); // dans tous les cas on réactive le bouton
    }
  }

  return (
    // Même gestion du clavier que sur la connexion
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* keyboardShouldPersistTaps : le bouton marche même avec le clavier ouvert */}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* En-tête avec l'icône calendrier */}
        <AuthHeader title="Créer un compte" subtitle="Rejoignez l'agenda de votre association." />

        {/* La carte blanche avec le formulaire */}
        <View style={styles.card}>
          <Input
            label="Nom"
            value={name}
            onChangeText={setName}
            placeholder="Votre nom"
            autoCapitalize="words" // majuscule au début de chaque mot
            autoComplete="name" // le téléphone peut proposer le nom
            error={errors.name}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="vous@exemple.com"
            keyboardType="email-address" // clavier avec le @
            autoCapitalize="none" // pas de majuscule auto
            autoComplete="email"
            error={errors.email}
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // saisie cachée
            autoCapitalize="none"
            error={errors.password}
          />

          <Input
            label="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry // saisie cachée
            autoCapitalize="none"
            error={errors.confirmPassword}
          />

          {/* Encadré rouge si l'inscription a raté */}
          {submitError ? (
            <View style={styles.submitErrorBox}>
              <Text style={styles.submitError}>{submitError}</Text>
            </View>
          ) : null}

          <Button
            title={isSubmitting ? "Création..." : "Créer mon compte"} // le texte change pendant l'envoi
            onPress={handleSubmit}
            disabled={isSubmitting} // pas de double envoi
          />
        </View>

        {/* RGPD : on dit clairement où vont les données (en local, dans AsyncStorage) */}
        <Text style={styles.privacy}>
          Vos informations sont enregistrées uniquement sur cet appareil. Votre mot de passe
          n'est jamais conservé en clair.
        </Text>
        {/* Pas de lien vers /login : la flèche retour du header y ramène déjà.
            Un Link ajouterait un deuxième écran de connexion par-dessus. */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1, // tout l'écran
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1, // le contenu remplit l'écran, du coup on peut le centrer verticalement
    justifyContent: "center", // centré verticalement
    padding: spacing.lg, // marge autour
    gap: spacing.md, // espace entre les blocs
  },
  // La carte blanche qui regroupe les champs et le bouton
  card: {
    backgroundColor: colors.surface, // fond blanc
    borderRadius: radius.lg, // coins arrondis
    borderWidth: borderWidth.thin, // bordure fine
    borderColor: colors.border,
    padding: spacing.lg, // espace intérieur
    gap: spacing.md, // espace entre les champs
  },
  // Encadré rouge pâle pour l'erreur d'inscription
  submitErrorBox: {
    backgroundColor: colors.dangerSoft, // fond rose
    borderRadius: radius.md,
    padding: spacing.ms,
  },
  submitError: {
    color: colors.danger, // texte rouge
    textAlign: "center",
    fontWeight: fontWeight.semibold,
  },
  privacy: {
    fontSize: fontSize.sm, // petit texte
    color: colors.textMuted, // gris
    textAlign: "center",
    lineHeight: lineHeight.sm, // lignes aérées
    paddingHorizontal: spacing.md, // pas collé aux bords
  },
});
