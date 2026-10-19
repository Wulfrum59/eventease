// src/app/(auth)/register.tsx
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { hasErrors, validateRegisterForm, type FieldErrors } from "@/utils/validation";

type RegisterField = "name" | "email" | "password" | "confirmPassword";

export default function RegisterScreen() {
  const { register } = useAuth();

  // Formulaire contrôlé : une variable de state par champ
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>

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

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

        <Button
          title={isSubmitting ? "Création..." : "Créer mon compte"}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
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
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  submitError: {
    color: colors.danger,
    textAlign: "center",
  },
});