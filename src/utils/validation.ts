// Fonctions de validation "pures" : mêmes entrées = même résultat, et elles ne touchent à rien d'autre.

export const MIN_PASSWORD_LENGTH = 6; // longueur mini d'un mot de passe

// Regex volontairement simple : "truc@truc.truc", sans espaces
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Un objet { nomDuChamp: message }. Partial parce que seuls les champs en erreur sont remplis
export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

// ----- Règles champ par champ -----
// Chaque fonction renvoie le message d'erreur, ou undefined si c'est bon

// Vérifie l'email
export function validateEmail(email: string): string | undefined {
  if (email.trim() === "") return "L'email est obligatoire."; // champ vide (ou que des espaces)
  if (!EMAIL_REGEX.test(email.trim())) return "Format d'email invalide."; // ne ressemble pas à un email
  return undefined; // tout est bon
}

// Vérifie le mot de passe à l'inscription
export function validatePassword(password: string): string | undefined {
  if (password === "") return "Le mot de passe est obligatoire."; // rien de tapé
  if (password.length < MIN_PASSWORD_LENGTH) { // trop court
    return `Au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }
  return undefined; // ok
}

// Vérifie le nom
export function validateName(name: string): string | undefined {
  if (name.trim() === "") return "Le nom est obligatoire."; // vide
  return undefined; // ok
}

// Renvoie true si au moins un champ a un message d'erreur
export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((message) => message !== undefined); // on cherche un message non vide
}

// ----- Validation des formulaires en entier -----
// Chaque fonction renvoie l'objet { champ: message }, qu'on passe direct à setErrors

// Les champs du formulaire de connexion
type LoginValues = {
  email: string;
  password: string;
};

// Valide le formulaire de connexion
export function validateLoginForm(values: LoginValues): FieldErrors<keyof LoginValues> {
  return {
    email: validateEmail(values.email), // même règle que partout
    // À la connexion on regarde juste s'il est rempli : si la règle de longueur change un jour,
    // les vieux comptes pourront quand même se connecter
    password: values.password === "" ? "Le mot de passe est obligatoire." : undefined,
  };
}

// Les champs du formulaire d'inscription
type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// Valide le formulaire d'inscription
export function validateRegisterForm(values: RegisterValues): FieldErrors<keyof RegisterValues> {
  return {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: // les deux mots de passe doivent être identiques
      values.confirmPassword !== values.password
        ? "Les mots de passe ne correspondent pas."
        : undefined,
  };
}

export const MAX_TITLE_LENGTH = 80; // longueur max d'un titre d'événement

// Titre obligatoire et pas trop long (on ignore les espaces au début et à la fin)
function validateTitle(title: string): string | undefined {
  const trimmed = title.trim(); // on enlève les espaces autour
  if (trimmed === "") return "Le titre est obligatoire."; // vide
  if (trimmed.length > MAX_TITLE_LENGTH) return `${MAX_TITLE_LENGTH} caractères maximum.`; // trop long
  return undefined; // ok
}

// Les champs du formulaire d'événement
type EventFormValues = {
  title: string;
  description: string;
  date: string; // en ISO
};

// Valide le formulaire de création / modif d'événement
export function validateEventForm(values: EventFormValues): FieldErrors<keyof EventFormValues> {
  return {
    title: validateTitle(values.title),
    description: values.description.trim() === "" ? "La description est obligatoire." : undefined,
    // Date.parse renvoie NaN si la chaîne n'est pas une vraie date
    date: Number.isNaN(Date.parse(values.date)) ? "Date invalide." : undefined,
  };
}
