import { Coordinates } from "@/types";

export const isValidCoordinates = (
  value: Coordinates | null | undefined,
): boolean => {
  if (!value || typeof value !== "object") return false;

  const { latitude, longitude } = value;
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
};

export const calculateDistance = (
  origin: Coordinates,
  destination: Coordinates,
) => {
  if (!isValidCoordinates(origin) || !isValidCoordinates(destination))
    return null;

  if (!origin || !destination) return null;

  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(destination.latitude - origin.latitude);
  const longitudeDelta = radians(destination.longitude - origin.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(origin.latitude)) *
      Math.cos(radians(destination.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371008.8 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
};

export function formatDistance(meters: number | null | undefined): string {
  if (meters == null || !Number.isFinite(meters) || meters < 0)
    return "Distância indisp.";
  if (meters < 1) return "Menos de 1 m";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}
