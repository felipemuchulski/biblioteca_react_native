export const formatCarouselPagination = (
  template: string,
  current: number,
  maximum: number,
) => {
  if (!template || !current || !maximum) return "";

  return template
    .replace(/\bx\b/g, String(current))
    .replace(/\by\b/g, String(maximum));
};

export function formatTitleToInternValue(title: string) {
  if (!title) return;

  return title.toLowerCase().replaceAll(" ", "-");
}

export const convertUnknownToString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

export const verifyIfIsObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};
