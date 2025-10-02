import { useAuth } from "@/src/assets/context/AuthProvider";
import { Tabs, usePathname, useRouter } from "expo-router";
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

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
        }}
      />
      <Tabs.Screen
        name="linhas/index"
        options={{
          title: "Linhas",
        }}
      />
    </Tabs>
  );
}
