export function formatCarouselPagination(
  template: string,
  current: number,
  maximum: number,
): string {
  if (!template || !current || !maximum) return "";

  return template
    .replace(/\bx\b/g, String(current))
    .replace(/\by\b/g, String(maximum));
}

export function formatTitleToInternValue(title: string) {
  if (!title) return;
  return title.toLowerCase().replaceAll(" ", "-");
}
