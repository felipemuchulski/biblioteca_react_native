export const isEmptyObject = (obj: unknown): boolean => {
  return (
    obj !== null &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.keys(obj as Record<string, unknown>)?.length === 0
  );
};
