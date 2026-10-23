// Les textes français du calendrier (react-native-calendars est en anglais par défaut).
// Attention : la lib veut les jours en commençant par le dimanche, même si on affiche la semaine à partir du lundi.
export const CALENDAR_LOCALE_FR = {
  monthNames: [ // les mois en entier, pour le titre du calendrier
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."], // mois abrégés
  dayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], // jours en entier, dimanche d'abord
  dayNamesShort: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], // jours abrégés, affichés au-dessus des colonnes
  today: "Aujourd'hui", // le mot "aujourd'hui"
};
