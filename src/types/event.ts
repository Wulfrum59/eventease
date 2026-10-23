// La forme d'un événement tel qu'on le range dans le stockage
export type EventItem = {
  id: string; // identifiant unique, généré à la création
  title: string; // le titre affiché partout
  description: string; // le texte détaillé
  date: string; // date en ISO (une chaîne), jamais un objet Date : JSON.stringify le casserait
  createdBy: string; // id de la personne qui l'a créé
  participantIds: string[]; // ids des gens qui participent
  createdAt: string; // date de création, en ISO
  updatedAt: string; // date de dernière modif, en ISO
};
