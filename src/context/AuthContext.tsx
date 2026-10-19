import { createContext, useEffect, useState, type ReactNode } from "react";

import * as authService from "@/services/authService";
import type { LoginInput, RegisterInput } from "@/services/authService";
import type { PublicUser } from "@/types/user";

type AuthContextValue = {
  user: PublicUser | null; // null = personne n'est connecté
  isLoading: boolean; // true tant qu'on n'a pas fini de relire la session au démarrage
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

// Valeur par défaut null : signifie « utilisé en dehors d'un AuthProvider » (voir useAuth)
export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode; // Tout ce qui est placé entre <AuthProvider> et </AuthProvider>
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true dès le départ : on ne sait pas encore

  // Au lancement de l'app : relit la session enregistrée (l'utilisateur reste connecté)
  useEffect(() => {
    async function restoreSession() {
      try {
        setUser(await authService.getCurrentUser());
      } catch {
        setUser(null); // Stockage illisible : on repart déconnecté plutôt que de bloquer l'app
      } finally {
        setIsLoading(false); // Exécuté dans tous les cas, succès ou erreur
      }
    }
    restoreSession();
  }, []);

  // Les erreurs du service (mauvais mot de passe...) ne sont PAS attrapées ici :
  // elles remontent jusqu'à l'écran, qui affichera le message
  async function login(input: LoginInput) {
    const loggedUser = await authService.login(input);
    setUser(loggedUser); // Déclenche le re-render de tous les consommateurs du contexte
  }

  async function register(input: RegisterInput) {
    const newUser = await authService.register(input);
    setUser(newUser);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}