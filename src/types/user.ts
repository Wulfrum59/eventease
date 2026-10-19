// Utilisateur tel qu'il est stocké. Le mot de passe n'est JAMAIS stocké en clair.
export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string; // Chaîne aléatoire propre à chaque utilisateur, mélangée au mot de passe avant hachage
  createdAt: string; // Date ISO
};

// Ce que le reste de l'app a le droit de voir : sans hash ni sel
export type PublicUser = Pick<User, "id" | "name" | "email" | "createdAt">;