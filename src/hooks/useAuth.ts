import { useContext } from "react"; // pour lire un contexte
import { AuthContext } from "@/context/AuthContext"; // le contexte de connexion

// La porte d'entrée pour que les écrans accèdent à la connexion
export function useAuth() {
  const context = useContext(AuthContext); // on lit le contexte

  // Si c'est null, c'est qu'on a oublié le Provider : c'est un bug de dev, on le dit tout de suite
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider.");
  }

  return context; // user, isLoading, login, register, logout
}
