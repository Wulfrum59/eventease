// src/app/index.tsx
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>EventEase</Text>
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