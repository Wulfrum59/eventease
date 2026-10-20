<!-- README.md -->
# EventEase

Application mobile de gestion d'événements pour l'association EventEase.
Les membres et bénévoles peuvent consulter les événements, en créer et gérer leur participation.

> Prototype réalisé en 4 jours dans le cadre de la formation Concepteur Développeur d'Applications.


## Fonctionnalités

- [x] Inscription et connexion simulées (sans backend), mot de passe haché avec sel (SHA-256)
- [x] Liste des événements (titre, description, date), triée par date
- [x] Création, modification et suppression d'un événement (suppression avec confirmation)
- [x] Marquer un événement comme « participé » (participation propre à chaque utilisateur)
- [x] Persistance locale des données (AsyncStorage)

### Règles métier

- Seul le créateur d'un événement peut le modifier ou le supprimer.
- La participation n'est plus modifiable une fois l'événement passé.

## Stack technique

- React Native avec Expo (TypeScript)
- Expo Router (navigation par fichiers, construite sur React Navigation)
- Context API pour l'état global
- AsyncStorage pour la persistance locale

## Prérequis

- Node.js (développé avec la version 22.20)
- L'application Expo Go sur un téléphone Android ou iOS

## Installation et lancement

```bash
git clone https://github.com/Wulfrum59/eventease.git
cd eventease
npm install
npx expo start
```

Scanner ensuite le QR code avec Expo Go (téléphone et ordinateur sur le même réseau Wi-Fi).

## Auteur

Giovanny