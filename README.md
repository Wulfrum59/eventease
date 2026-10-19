<!-- README.md -->
# EventEase

Application mobile de gestion d'événements pour l'association EventEase.
Les membres et bénévoles peuvent consulter les événements, en créer et gérer leur participation.

> Prototype réalisé en 4 jours dans le cadre de la formation Concepteur Développeur d'Applications.

## Fonctionnalités

- [ ] Inscription et connexion simulées (sans backend)
- [ ] Liste des événements (titre, description, date)
- [ ] Création, modification et suppression d'un événement
- [ ] Marquer un événement comme « participé »
- [ ] Persistance locale des données (AsyncStorage)

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