// Icône d'un onglet de la barre du bas.
// expo-symbols affiche les icônes du système : SF Symbols sur iOS, Material Symbols sur Android et web.
import { SymbolView, type SymbolViewProps } from "expo-symbols"; // le composant icône + ses types
import type { ColorValue } from "react-native"; // type d'une couleur React Native (plus large qu'une simple string)

// Les props acceptées
type TabIconProps = {
  name: SymbolViewProps["name"]; // le nom de l'icône, avec un nom par plateforme { ios, android, web }
  color: ColorValue; // couleur donnée par la barre d'onglets (indigo si actif, gris sinon)
  size: number; // taille donnée par la barre d'onglets
};

export function TabIcon({ name, color, size }: TabIconProps) {
  return <SymbolView name={name} tintColor={color} size={size} />; // tintColor = couleur de l'icône
}
