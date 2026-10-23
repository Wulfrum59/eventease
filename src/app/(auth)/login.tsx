import { Link } from "expo-router"; // lien vers un autre écran
import { useState } from "react"; // pour retenir ce qui est tapé
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { AuthHeader } from "@/components/ui/AuthHeader"; // icône + titre
import { Button } from "@/components/ui/Button"; // notre bouton
import { Input } from "@/components/ui/Input"; // notre champ texte
import { borderWidth, colors, fontSize, fontWeight, radius, spacing } from "@/constants/theme"; // thème
import { useAuth } from "@/hooks/useAuth"; // pour se connecter
import { hasErrors, validateLoginForm, type FieldErrors } from "@/utils/validation"; // validation

// L'écran de connexion
export default function LoginScreen() {
  const { login } = useAuth(); // la fonction de connexion du contexte

  // ----- Ce qui est tapé dans le formulaire -----
  // Formulaire contrôlé : une variable de state par champ
  const [email, setEmail] = useState(""); // email
  const [password, setPassword] = useState(""); // mot de passe

  const [errors, setErrors] = useState<FieldErrors<"email" | "password">>({}); // erreurs par champ
  const [submitError, setSubmitError] = useState<string | null>(null); // erreur renvoyée par le service
  const [isSubmitting, setIsSubmitting] = useState(false); // connexion en cours ?

  // On vérifie le formulaire, puis on tente la connexion
  async function handleSubmit() {
    // On met le résultat dans une variable locale : juste après setErrors, "errors"
    // aurait encore l'ancienne valeur (le state n'est à jour qu'au prochain rendu)
    const validationErrors = validateLoginForm({ email, password });
    setErrors(validationErrors); // on affiche les erreurs sous les champs
    if (hasErrors(validationErrors)) return; // si y'a une erreur on s'arrête

    setSubmitError(null); // on efface l'ancienne erreur
    setIsSubmitting(true); // le bouton passe en "Connexion..."
    try {
      await login({ email, password }); // on se connecte
      // Pas besoin de router.push : le layout racine change d'écran tout seul quand user change
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue."); // ex : mauvais mot de passe
    } finally {
      setIsSubmitting(false); // dans tous les cas on réactive le bouton
    }
  }

  return (
    // Sur iOS le clavier cache les champs, donc on remonte le contenu.
    // Sur Android le système s'en occupe déjà.
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // on peut appuyer sur le bouton même clavier ouvert
      >
        {/* En-tête avec l'icône calendrier */}
        <AuthHeader
          title="Bienvenue sur EventEase"
          subtitle="Connectez-vous pour retrouver l'agenda de votre association."
        />

        {/* La carte blanche avec le formulaire */}
        <View style={styles.card}>
          <Input
            label="Email"
            value={email} // ce qui est affiché
            onChangeText={setEmail} // mise à jour à chaque lettre
            placeholder="vous@exemple.com" // texte d'exemple
            keyboardType="email-address" // clavier avec le @
            autoCapitalize="none" // sinon Android met une majuscule à la première lettre
            autoComplete="email" // le téléphone peut proposer l'email
            error={errors.email} // message d'erreur éventuel
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // cache ce qui est tapé
            autoCapitalize="none" // pas de majuscule auto
            error={errors.password}
          />

          {/* Encadré rouge si la connexion a raté */}
          {submitError ? (
            <View style={styles.submitErrorBox}>
              <Text style={styles.submitError}>{submitError}</Text>
            </View>
          ) : null}

          <Button
            title={isSubmitting ? "Connexion..." : "Se connecter"} // le texte change pendant l'envoi
            onPress={handleSubmit}
            disabled={isSubmitting} // pas de double envoi
          />
        </View>

        {/* Lien vers l'inscription */}
        <Link href="/register" style={styles.link}>
          Pas de compte ? <Text style={styles.linkStrong}>S'inscrire</Text>
        </Link>
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
    gap: spacing.md, // espace entre l'en-tête, la carte et le lien
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
  // Encadré rouge pâle pour l'erreur de connexion
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
  link: {
    color: colors.textMuted, // "Pas de compte ?" en gris
    fontSize: fontSize.md,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingVertical: spacing.sm, // zone d'appui plus grande, plus facile à toucher
  },
  linkStrong: {
    color: colors.primary, // "S'inscrire" en indigo
    fontWeight: fontWeight.bold, // et en gras
  },
});
