
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Écran de connexion</Text>
      <Button
        title="Connexion compte test"
        onPress={() => login({ email: "test@mail.com", password: "secret123" })}
      />
      {/* Link : navigation déclarative, comme une balise <a> */}
      <Link href="/register">Pas de compte ? S'inscrire</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: spacing.md,
  },
});