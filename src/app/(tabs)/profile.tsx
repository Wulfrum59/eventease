// src/app/(tabs)/profile.tsx
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      {/* user ne peut pas être null ici (écran protégé), mais TypeScript ne le sait pas : d'où le ?. */}
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      {/* Pas de router.push après logout : le layout redirige tout seul */}
      <Button title="Se déconnecter" variant="danger" onPress={logout} />
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
  name: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text,
  },
  email: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
});