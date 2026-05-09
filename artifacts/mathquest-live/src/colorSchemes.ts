export type ColorSchemeId =
  | "arcaneMidnight"
  | "emeraldForest"
  | "solarKingdom"
  | "oceanDepths"
  | "roseCrystal"
  | "emberForge"
  | "starlightAcademy";

export type ColorScheme = {
  id: ColorSchemeId;
  name: string;
  description: string;
  colors: {
    background: string;
    backgroundAlt: string;
    surface: string;
    surfaceStrong: string;
    button: string;
    buttonHover: string;
    text: string;
    textMuted: string;
    heading: string;
    primary: string;
    primaryHover: string;
    secondary: string;
    border: string;
    borderStrong: string;
    success: string;
    warning: string;
    danger: string;
  };
};

export const DEFAULT_COLOR_SCHEME_ID: ColorSchemeId = "arcaneMidnight";

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "arcaneMidnight",
    name: "Arcane Midnight",
    description: "Deep indigo, violet magic, and golden light.",
    colors: {
      background: "#0c0a1d",
      backgroundAlt: "#181134",
      surface: "#20163f",
      surfaceStrong: "#2b1f55",
      button: "#32215f",
      buttonHover: "#44307c",
      text: "#f1ecff",
      textMuted: "#c9bff2",
      heading: "#f5c84b",
      primary: "#8b5cf6",
      primaryHover: "#a78bfa",
      secondary: "#38d9c4",
      border: "#6650a8",
      borderStrong: "#f5c84b",
      success: "#4ade80",
      warning: "#fbbf24",
      danger: "#fb7185",
    },
  },
  {
    id: "emeraldForest",
    name: "Emerald Forest",
    description: "Green, teal, warm gold, and nature adventure.",
    colors: {
      background: "#05170f",
      backgroundAlt: "#0b2a1c",
      surface: "#123522",
      surfaceStrong: "#17462d",
      button: "#1d5737",
      buttonHover: "#267449",
      text: "#e8fff1",
      textMuted: "#a8d7bd",
      heading: "#f4c95d",
      primary: "#34d399",
      primaryHover: "#6ee7b7",
      secondary: "#2dd4bf",
      border: "#2f7d52",
      borderStrong: "#f4c95d",
      success: "#86efac",
      warning: "#facc15",
      danger: "#fb7185",
    },
  },
  {
    id: "solarKingdom",
    name: "Solar Kingdom",
    description: "Gold, amber, cream, and heroic fantasy warmth.",
    colors: {
      background: "#1d1205",
      backgroundAlt: "#3a2408",
      surface: "#4a2d0a",
      surfaceStrong: "#623b0b",
      button: "#75480f",
      buttonHover: "#986113",
      text: "#fff4d6",
      textMuted: "#e7c98a",
      heading: "#ffe08a",
      primary: "#f59e0b",
      primaryHover: "#fbbf24",
      secondary: "#38bdf8",
      border: "#b7791f",
      borderStrong: "#ffe08a",
      success: "#84cc16",
      warning: "#fde047",
      danger: "#f87171",
    },
  },
  {
    id: "oceanDepths",
    name: "Ocean Depths",
    description: "Navy, cyan, seafoam, and pearl-lit mystery.",
    colors: {
      background: "#031525",
      backgroundAlt: "#06243a",
      surface: "#0b314a",
      surfaceStrong: "#0f4565",
      button: "#14577d",
      buttonHover: "#1f78a8",
      text: "#e6fbff",
      textMuted: "#a6d9e8",
      heading: "#b9f6ff",
      primary: "#22d3ee",
      primaryHover: "#67e8f9",
      secondary: "#a7f3d0",
      border: "#1f7b9d",
      borderStrong: "#b9f6ff",
      success: "#34d399",
      warning: "#fbbf24",
      danger: "#fb7185",
    },
  },
  {
    id: "roseCrystal",
    name: "Rose Crystal",
    description: "Rose, violet, soft pink, and bright crystal highlights.",
    colors: {
      background: "#1c0b1d",
      backgroundAlt: "#331336",
      surface: "#421942",
      surfaceStrong: "#5a2358",
      button: "#6d2a68",
      buttonHover: "#87357e",
      text: "#fff1fb",
      textMuted: "#f2bade",
      heading: "#f9a8d4",
      primary: "#e879f9",
      primaryHover: "#f0abfc",
      secondary: "#f472b6",
      border: "#a855a8",
      borderStrong: "#f9a8d4",
      success: "#86efac",
      warning: "#fde047",
      danger: "#fb7185",
    },
  },
  {
    id: "emberForge",
    name: "Ember Forge",
    description: "Dark red, burnt orange, bronze, and charcoal glow.",
    colors: {
      background: "#160908",
      backgroundAlt: "#2a100c",
      surface: "#381711",
      surfaceStrong: "#4c2117",
      button: "#5f2a1a",
      buttonHover: "#7c361f",
      text: "#fff0df",
      textMuted: "#d8a98e",
      heading: "#f6ad55",
      primary: "#f97316",
      primaryHover: "#fb923c",
      secondary: "#facc15",
      border: "#8a4427",
      borderStrong: "#f6ad55",
      success: "#84cc16",
      warning: "#fbbf24",
      danger: "#f87171",
    },
  },
  {
    id: "starlightAcademy",
    name: "Starlight Academy",
    description: "Midnight blue, silver, lavender, and white-gold.",
    colors: {
      background: "#071124",
      backgroundAlt: "#111c36",
      surface: "#17213d",
      surfaceStrong: "#202d52",
      button: "#293763",
      buttonHover: "#374785",
      text: "#f3f7ff",
      textMuted: "#cbd5e1",
      heading: "#fde68a",
      primary: "#93c5fd",
      primaryHover: "#bfdbfe",
      secondary: "#c4b5fd",
      border: "#52618d",
      borderStrong: "#fde68a",
      success: "#86efac",
      warning: "#facc15",
      danger: "#f87171",
    },
  },
];

export function getColorScheme(id: string | undefined) {
  return COLOR_SCHEMES.find((scheme) => scheme.id === id) ?? COLOR_SCHEMES[0];
}

export function applyColorScheme(id: string | undefined) {
  if (typeof document === "undefined") return;
  const scheme = getColorScheme(id);
  const root = document.documentElement;
  root.dataset.colorScheme = scheme.id;

  for (const [key, value] of Object.entries(scheme.colors)) {
    root.style.setProperty(`--mq-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value);
  }
}
