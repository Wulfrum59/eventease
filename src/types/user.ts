// Un utilisateur tel qu'on le range dans le stockage (le mot de passe n'y est jamais en clair)
export type User = {
  id: string; // identifiant unique
  name: string; // nom affiché sur le profil
  email: string; // email, toujours en minuscules
  passwordHash: string; // empreinte du mot de passe (le hash), pas le mot de passe lui-même
  salt: string; // chaîne aléatoire propre à chaque compte, mélangée au mot de passe avant le hash
  createdAt: string; // date d'inscription, en ISO
};

// Ce que le reste de l'app a le droit de voir : on garde tout sauf le hash et le sel
export type PublicUser = Pick<User, "id" | "name" | "email" | "createdAt">;
