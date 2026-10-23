import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { AuthHeader } from "@/components/ui/AuthHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { borderWidth, colors, fontSize, fontWeight, lineHeight, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { hasErrors, validateRegisterForm, type FieldErrors } from "@/utils/validation";

type RegisterField = "name" | "email" | "password" | "confirmPassword";

// Écran d'inscription
export default function RegisterScreen() {
  const { register } = useAuth();

  // ----- State du formulaire -----
  // Formulaire contrôlé : une variable de state par champ
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valide le formulaire, puis crée le compte
  async function handleSubmit() {
    // Variable locale : "errors" ne sera à jour qu'au prochain rendu
    const validationErrors = validateRegisterForm({ name, email, password, confirmPassword });
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      // confirmPassword n'est PAS envoyé : il ne sert qu'à la vérification du formulaire
      await register({ name, email, password });
      // Pas de router.push : setUser dans le contexte → le layout redirige vers les onglets
    } catch (error) {
      // Ex : "Un compte existe déjà avec cet email."
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // Même gestion du clavier que l'écran de connexion
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AuthHeader title="Créer un compte" subtitle="Rejoignez l'agenda de votre association." />

        {/* Carte du formulaire */}
        <View style={styles.card}>
          <Input
            label="Nom"
            value={name}
            onChangeText={setName}
            placeholder="Votre nom"
            autoCapitalize="words" // Majuscule au début de chaque mot
            autoComplete="name"
            error={errors.name}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="vous@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />

          <Input
            label="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirmPassword}
          />

          {submitError ? (
            <View style={styles.submitErrorBox}>
              <Text style={styles.submitError}>{submitError}</Text>
            </View>
          ) : null}

          <Button
            title={isSubmitting ? "Création..." : "Créer mon compte"}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </View>

        {/* Transparence RGPD : on indique où vont les données saisies (stockage local AsyncStorage) */}
        <Text style={styles.privacy}>
          Vos informations sont enregistrées uniquement sur cet appareil. Votre mot de passe
          n'est jamais conservé en clair.
        </Text>
        {/* Pas de lien vers /login : la flèche retour du header ramène à l'écran de connexion.
            Un Link empilerait un DEUXIÈME écran de connexion par-dessus. */}
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
  // Encadré rouge pâle pour l'erreur d'inscription
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
  privacy: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: lineHeight.sm,
    paddingHorizontal: spacing.md,
  },
});
