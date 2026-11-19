import { useProfile } from "@/hooks/use-profile";

export function useIsAuthenticated() {
  const { user } = useProfile();
  return user !== null;
}
