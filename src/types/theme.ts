export interface ThemePalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  accentWarm: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  glow: string;
}

export interface ThemeTypography {
  fontFamily: string;
  codeFontFamily: string;
  headingWeight: string;
  bodyWeight: string;
}

export interface ThemeAesthetic {
  style: string;
  borderRadius: string;
  cardBlur: string;
  shadowIntensity: string;
  animationSpeed: string;
  glowRadius: string;
}

export interface ThemeGradient {
  hero: string;
  timeline: string;
  text: string;
}

export interface Theme {
  lastUpdated: string;
  palette: ThemePalette;
  typography: ThemeTypography;
  aesthetic: ThemeAesthetic;
  gradient: ThemeGradient;
  trendNote: string;
}
