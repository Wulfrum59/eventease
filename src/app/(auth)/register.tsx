// src/app/(auth)/register.tsx — PROVISOIRE : formulaire réel à l'étape 1.7
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text>Écran d'inscription</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});