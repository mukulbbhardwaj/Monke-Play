export type GameMeta = {
  id: string;
  name: string;
  link: string;
  embed?: boolean;
};

export const GAMES: GameMeta[] = [
  { id: "snake", name: "Snake", link: "https://saperra-legend.vercel.app/" },
  { id: "ramsetu", name: "Ram Setu", link: "https://vanar-sena.github.io/Ram-Setu/" },
  { id: "savemonke", name: "Save Monke", link: "https://savemonke.vercel.app/" },
];
