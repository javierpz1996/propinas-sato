export const SITE_FONTS = [
  {
    id: "sans",
    label: "Sans",
    family: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "serif",
    label: "Serif",
    family: 'Georgia, "Times New Roman", serif',
  },
  {
    id: "mono",
    label: "Mono",
    family: "var(--font-mono), ui-monospace, Menlo, monospace",
  },
] as const;

export type SiteFontId = (typeof SITE_FONTS)[number]["id"];

export function normalizeSiteFont(value?: string | null): SiteFontId {
  if (value === "serif" || value === "mono" || value === "sans") return value;
  return "sans";
}

export function fontFamilyCss(value?: string | null) {
  const id = normalizeSiteFont(value);
  return SITE_FONTS.find((font) => font.id === id)?.family ?? SITE_FONTS[0].family;
}
