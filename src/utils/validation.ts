// Fonctions PURES de validation : mêmes entrées → même résultat, aucun effet de bord.

export const MIN_PASSWORD_LENGTH = 6;

// Volontairement simple : "quelque chose@quelque chose.quelque chose", sans espaces
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Objet { nomDuChamp: message } ; Partial car seuls les champs en erreur sont présents
export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

export function validateEmail(email: string): string | undefined {
  if (email.trim() === "") return "L'email est obligatoire.";
  if (!EMAIL_REGEX.test(email.trim())) return "Format d'email invalide.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (password === "") return "Le mot de passe est obligatoire.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }
  return undefined;
}

export function validateName(name: string): string | undefined {
  if (name.trim() === "") return "Le nom est obligatoire.";
  return undefined;
}

// Vrai si au moins un champ a un message d'erreur
export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((message) => message !== undefined);
}

type LoginValues = {
  email: string;
  password: string;
};

export function validateLoginForm(values: LoginValues): FieldErrors<keyof LoginValues> {
  return {
    email: validateEmail(values.email),
    // À la connexion, on vérifie seulement la présence : un ancien compte pourrait
    // avoir un mot de passe plus court si la règle change un jour
    password: values.password === "" ? "Le mot de passe est obligatoire." : undefined,
  };
}

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function validateRegisterForm(values: RegisterValues): FieldErrors<keyof RegisterValues> {
  return {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword:
      values.confirmPassword !== values.password
        ? "Les mots de passe ne correspondent pas."
        : undefined,
  };
}

export const MAX_TITLE_LENGTH = 80;

function validateTitle(title: string): string | undefined {
  const trimmed = title.trim();
  if (trimmed === "") return "Le titre est obligatoire.";
  if (trimmed.length > MAX_TITLE_LENGTH) return `${MAX_TITLE_LENGTH} caractères maximum.`;
  return undefined;
}


type EventFormValues = {
  title: string;
  description: string;
  date: string; // ISO
};

export function validateEventForm(values: EventFormValues): FieldErrors<keyof EventFormValues> {
  return {
    title: validateTitle(values.title),
    description: values.description.trim() === "" ? "La description est obligatoire." : undefined,

    // Date.parse renvoie NaN si la chaîne n'est pas une date valide
    
    date: Number.isNaN(Date.parse(values.date)) ? "Date invalide." : undefined,
  };
}