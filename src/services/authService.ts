// Authentification simulée : pas de serveur, tous les comptes sont rangés en local dans AsyncStorage.
import * as Crypto from "expo-crypto"; // pour hacher les mots de passe

import { STORAGE_KEYS } from "@/constants/storageKeys"; // les clés de stockage
import { getItem, removeItem, setItem } from "@/services/storage"; // lecture / écriture du stockage
import type { PublicUser, User } from "@/types/user"; // les types utilisateur
import { generateId } from "@/utils/id"; // pour fabriquer des ids uniques

// Ce qu'on reçoit du formulaire d'inscription
export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

// Ce qu'on reçoit du formulaire de connexion
export type LoginInput = {
  email: string;
  password: string;
};

// ----- Fonctions internes (pas exportées, utilisées que dans ce fichier) -----

// Hache le mot de passe avec le sel devant, en SHA-256
function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + password); // renvoie l'empreinte en texte
}

// "  Alice@Mail.com " et "alice@mail.com" doivent tomber sur le même compte
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase(); // on vire les espaces autour et on passe en minuscules
}

// Enlève le hash et le sel avant de donner l'utilisateur au reste de l'app
function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

// Lit la liste de tous les comptes.
// Au tout premier lancement la clé n'existe pas, getItem renvoie null, donc on renvoie une liste vide
async function getUsers(): Promise<User[]> {
  return (await getItem<User[]>(STORAGE_KEYS.users)) ?? []; // ?? : si c'est null, on prend []
}

// ----- Fonctions utilisées par le reste de l'app -----

// Crée un compte (email unique, mot de passe haché) et connecte direct la personne
export async function register({ name, email, password }: RegisterInput): Promise<PublicUser> {
  const users = await getUsers(); // tous les comptes existants
  const normalizedEmail = normalizeEmail(email); // email nettoyé

  if (users.some((user) => user.email === normalizedEmail)) { // quelqu'un a déjà cet email ?
    throw new Error("Un compte existe déjà avec cet email."); // on bloque, l'écran affichera le message
  }

  const salt = generateId(); // un UUID au hasard, ça fait un très bon sel
  const newUser: User = {
    id: generateId(), // nouvel id
    name: name.trim(), // nom sans espaces autour
    email: normalizedEmail,
    passwordHash: await hashPassword(password, salt), // on garde l'empreinte, pas le mot de passe
    salt, // on garde le sel pour pouvoir revérifier à la connexion
    createdAt: new Date().toISOString(), // maintenant, en ISO
  };

  // Nouveau tableau avec le compte en plus : on ne modifie jamais "users" directement (pas de push)
  await setItem(STORAGE_KEYS.users, [...users, newUser]);
  // On enregistre la session : la personne est connectée tout de suite
  await setItem(STORAGE_KEYS.session, newUser.id);

  return toPublicUser(newUser); // on renvoie la version sans données sensibles
}

// Vérifie l'email et le mot de passe, puis ouvre la session
export async function login({ email, password }: LoginInput): Promise<PublicUser> {
  const users = await getUsers(); // tous les comptes
  const user = users.find((u) => u.email === normalizeEmail(email)); // on cherche le compte par email

  // Même message si l'email n'existe pas ou si le mot de passe est faux :
  // comme ça on ne dit pas à un petit malin quels emails ont un compte
  const invalidCredentials = new Error("Email ou mot de passe incorrect.");

  if (!user) throw invalidCredentials; // email inconnu

  // On hache ce qui a été tapé avec le sel de ce compte-là, puis on compare les deux empreintes
  const hash = await hashPassword(password, user.salt);
  if (hash !== user.passwordHash) throw invalidCredentials; // pas pareil = mauvais mot de passe

  await setItem(STORAGE_KEYS.session, user.id); // on retient qui est connecté
  return toPublicUser(user); // on renvoie la version sans données sensibles
}

// Déconnexion : le compte reste là, on efface juste la session
export async function logout(): Promise<void> {
  await removeItem(STORAGE_KEYS.session);
}

// Appelée au lancement de l'app : est-ce que quelqu'un était déjà connecté ?
export async function getCurrentUser(): Promise<PublicUser | null> {
  const userId = await getItem<string>(STORAGE_KEYS.session); // id enregistré dans la session
  if (!userId) return null; // pas de session = personne de connecté

  const users = await getUsers(); // tous les comptes
  const user = users.find((u) => u.id === userId); // on retrouve le compte de la session

  // Si le compte n'existe plus (session orpheline), on fait comme si personne n'était connecté
  return user ? toPublicUser(user) : null;
}
