import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { AuthHeader } from "@/components/ui/AuthHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { borderWidth, colors, fontSize, fontWeight, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { hasErrors, validateLoginForm, type FieldErrors } from "@/utils/validation";

// Écran de connexion
export default function LoginScreen() {
  const { login } = useAuth();

  // ----- State du formulaire -----
  // Formulaire contrôlé : une variable de state par champ
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<FieldErrors<"email" | "password">>({});
  const [submitError, setSubmitError] = useState<string | null>(null); // Erreur renvoyée par le service
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valide le formulaire, puis tente la connexion
  async function handleSubmit() {
    // On valide dans une variable LOCALE : juste après setErrors, "errors" contiendrait
    // encore l'ancienne valeur (la mise à jour du state n'est visible qu'au prochain rendu)
    const validationErrors = validateLoginForm({ email, password });
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      // Pas de router.push : le layout racine redirige quand user change
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // Sur iOS, le clavier recouvre les champs : on remonte le contenu.
    // Sur Android, le système redimensionne déjà la fenêtre.
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // Un appui sur le bouton fonctionne même clavier ouvert
      >
        <AuthHeader
          title="Bienvenue sur EventEase"
          subtitle="Connectez-vous pour retrouver l'agenda de votre association."
        />

        {/* Carte du formulaire */}
        <View style={styles.card}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="vous@exemple.com"
            keyboardType="email-address" // Clavier avec le @
            autoCapitalize="none" // Sinon Android met une majuscule à la première lettre
            autoComplete="email"
            error={errors.email}
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Masque la saisie
            autoCapitalize="none"
            error={errors.password}
          />

          {submitError ? (
            <View style={styles.submitErrorBox}>
              <Text style={styles.submitError}>{submitError}</Text>
            </View>
          ) : null}

          <Button
            title={isSubmitting ? "Connexion..." : "Se connecter"}
            onPress={handleSubmit}
            disabled={isSubmitting} // Empêche le double envoi
          />
        </View>

        <Link href="/register" style={styles.link}>
          Pas de compte ? <Text style={styles.linkStrong}>S'inscrire</Text>
        </Link>
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
    flexGrow: 1, // Le contenu remplit l'écran, ce qui permet de le centrer verticalement
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  // Carte blanche qui regroupe les champs et le bouton
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  // Encadré rouge pâle pour l'erreur de connexion
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
  link: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingVertical: spacing.sm, // Zone d'appui plus confortable
  },
  linkStrong: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
});
