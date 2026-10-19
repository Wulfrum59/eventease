// Représente un événement tel qu'il est stocké.
export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string; // Date ISO, jamais un objet Date (perdu par JSON.stringify)
  createdBy: string; // Id de l'utilisateur créateur
  participantIds: string[]; // Ids des utilisateurs qui participent
  createdAt: string;
  updatedAt: string;
};