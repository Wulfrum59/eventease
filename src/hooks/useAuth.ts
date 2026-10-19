import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

// Point d'accès unique au contexte d'authentification pour les écrans
export function useAuth() {
  const context = useContext(AuthContext);

  // Oubli du Provider = bug du développeur : on le signale immédiatement et clairement
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider.");
  }

  return context;
}