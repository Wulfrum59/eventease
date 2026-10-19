// Authentification SIMULÉE : tous les comptes sont stockés localement dans AsyncStorage.
import * as Crypto from "expo-crypto";

import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getItem, removeItem, setItem } from "@/services/storage";
import type { PublicUser, User } from "@/types/user";
import { generateId } from "@/utils/id";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};


// Hache le mot de passe précédé du sel, en SHA-256
function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + password);
}

// "  Alice@Mail.com " et "alice@mail.com" doivent désigner le même compte
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Retire les données sensibles avant de transmettre l'utilisateur au reste de l'app
function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

// Premier lancement : la clé n'existe pas encore, getItem renvoie null → liste vide
async function getUsers(): Promise<User[]> {
  return (await getItem<User[]>(STORAGE_KEYS.users)) ?? [];
}

// ----- API publique du service -----

export async function register({ name, email, password }: RegisterInput): Promise<PublicUser> {
  const users = await getUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("Un compte existe déjà avec cet email.");
  }

  const salt = generateId(); // Un UUID aléatoire fait un très bon sel
  const newUser: User = {
    id: generateId(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password, salt),
    salt,
    createdAt: new Date().toISOString(),
  };

  // Nouveau tableau : on ne modifie jamais "users" directement (pas de push)
  await setItem(STORAGE_KEYS.users, [...users, newUser]);
  // L'inscription connecte directement l'utilisateur
  await setItem(STORAGE_KEYS.session, newUser.id);

  return toPublicUser(newUser);
}

export async function login({ email, password }: LoginInput): Promise<PublicUser> {
  const users = await getUsers();
  const user = users.find((u) => u.email === normalizeEmail(email));

  // Même message que l'email soit inconnu ou le mot de passe faux :
  // on ne révèle pas à un attaquant quels emails ont un compte
  const invalidCredentials = new Error("Email ou mot de passe incorrect.");

  if (!user) throw invalidCredentials;

  // On hache la saisie avec le sel DE CET utilisateur, puis on compare les empreintes
  const hash = await hashPassword(password, user.salt);
  if (hash !== user.passwordHash) throw invalidCredentials;

  await setItem(STORAGE_KEYS.session, user.id);
  return toPublicUser(user);
}

export async function logout(): Promise<void> {
  await removeItem(STORAGE_KEYS.session);
}

// Appelée au démarrage de l'app : quelqu'un était-il connecté ?
export async function getCurrentUser(): Promise<PublicUser | null> {
  const userId = await getItem<string>(STORAGE_KEYS.session);
  if (!userId) return null;

  const users = await getUsers();
  const user = users.find((u) => u.id === userId);

  // Session orpheline (compte introuvable) : on considère que personne n'est connecté
  return user ? toPublicUser(user) : null;
}