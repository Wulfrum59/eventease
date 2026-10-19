import { Stack } from "expo-router";

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    // Le Provider enveloppe toute la navigation : chaque écran peut appeler useAuth()
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}