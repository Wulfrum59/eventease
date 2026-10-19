// Utilisateur tel qu'il est stocké. Le mot de passe n'est JAMAIS stocké en clair.
export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string; // Date ISO
};