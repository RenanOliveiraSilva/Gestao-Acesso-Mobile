import * as SplashScreen from "expo-splash-screen";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserStorage } from "../../utils/userStorage";

type UserData = {
  idColaborador: string | null;
  nome: string | null;
  token: string | null;
  email: string | null;
  role: string | null;
};

type AuthContextType = {
  user: UserData;
  loading: boolean;
  signIn: (data: UserData) => Promise<void>;
  signOut: () => Promise<void>;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData>({
    idColaborador: null,
    nome: null,
    email: null,
    token: null,
    role: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await UserStorage.getUserData();
      setUser(data);
      setLoading(false);
      SplashScreen.hideAsync().catch(() => {});
    })();
  }, []);

  const signIn = async (data: UserData) => {
    await UserStorage.saveUserData({
      idColaborador: data.idColaborador || "",
      nome: data.nome || "",
      token: data.token || "",
      email: data.email || "",
      role: data.role || "",
    } as any);
    setUser(data);
  };

  const signOut = async () => {
    await UserStorage.clearUserData();
    setUser({
      idColaborador: null,
      nome: null,
      token: null,
      email: null,
      role: null,
    });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
      isLoggedIn: Boolean(user.token),
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
