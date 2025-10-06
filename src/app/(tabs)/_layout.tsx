import { useAuth } from "@/src/assets/context/AuthProvider";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace("/");
      }
    }
  }, [loading, isLoggedIn, pathname]);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
