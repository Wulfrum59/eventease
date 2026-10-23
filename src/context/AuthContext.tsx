// Contexte de connexion : rend la personne connectée dispo partout dans l'app,
// sans devoir la passer de composant en composant avec des props.
import { createContext, useEffect, useState, type ReactNode } from "react";

import * as authService from "@/services/authService"; // toutes les fonctions du service d'auth
import type { LoginInput, RegisterInput } from "@/services/authService"; // les types des formulaires
import type { PublicUser } from "@/types/user"; // l'utilisateur sans données sensibles

// Ce que le contexte donne aux écrans
type AuthContextValue = {
  user: PublicUser | null; // null = personne de connecté
  isLoading: boolean; // true tant qu'on n'a pas fini de relire la session au démarrage
  login: (input: LoginInput) => Promise<void>; // se connecter
  register: (input: RegisterInput) => Promise<void>; // s'inscrire
  logout: () => Promise<void>; // se déconnecter
};

// Valeur par défaut null = "utilisé en dehors d'un AuthProvider" (useAuth s'en sert pour râler)
export const AuthContext = createContext<AuthContextValue | null>(null);

// Les props du Provider
type AuthProviderProps = {
  children: ReactNode; // tout ce qu'on met entre <AuthProvider> et </AuthProvider>
};

// Le composant qui garde l'état de connexion et le partage à tous ses enfants
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<PublicUser | null>(null); // personne de connecté au départ
  const [isLoading, setIsLoading] = useState(true); // true direct : on ne sait pas encore s'il y a une session

  // Au lancement de l'app on relit la session, pour que la personne reste connectée
  useEffect(() => {
    // On crée une fonction async à l'intérieur, parce qu'un useEffect ne peut pas être async lui-même
    async function restoreSession() {
      try {
        setUser(await authService.getCurrentUser()); // on récupère l'utilisateur (ou null)
      } catch {
        setUser(null); // stockage illisible : on repart déconnecté plutôt que de bloquer l'app
      } finally {
        setIsLoading(false); // passe ici dans tous les cas, que ça marche ou pas
      }
    }
    restoreSession(); // on la lance
  }, []); // tableau vide = une seule fois, au montage

  // Les erreurs du service (mauvais mot de passe, email déjà pris...) ne sont pas attrapées ici :
  // elles remontent jusqu'à l'écran, qui affiche le message

  // Connexion : on vérifie les identifiants puis on garde l'utilisateur en mémoire
  async function login(input: LoginInput) {
    const loggedUser = await authService.login(input); // vérif dans le service
    setUser(loggedUser); // tous les écrans qui utilisent le contexte se mettent à jour
  }

  // Inscription : on crée le compte, la personne est connectée direct
  async function register(input: RegisterInput) {
    const newUser = await authService.register(input); // création dans le service
    setUser(newUser); // on la connecte
  }

  // Déconnexion : on efface la session, user repasse à null et le layout renvoie sur la connexion
  async function logout() {
    await authService.logout(); // efface la session du stockage
    setUser(null); // plus personne de connecté
  }

  return (
    // On partage ces valeurs à tous les composants enfants
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
