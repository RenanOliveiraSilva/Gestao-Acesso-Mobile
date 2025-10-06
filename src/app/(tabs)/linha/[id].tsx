import { showToastTop } from "@/src/utils/showToast";
import { UserStorage } from "@/src/utils/userStorage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import ButtonComponent from "../../components/button";

type StoredUser = {
  idColaborador: string | null;
  nome: string | null;
  token: string | null;
  email: string | null;
  role: string | null;
};

export default function LinhaPage() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState<StoredUser>({
    idColaborador: null,
    nome: null,
    token: null,
    email: null,
    role: null,
  });

  const handleGetUserData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UserStorage.getUserData();
      if (!data.token) {
        showToastTop("error", "Sessão expirada. Faça login novamente.");
      }
      setUserData(data);
    } catch (err) {
      console.error(err);
      showToastTop("error", "Falha ao obter dados do usuário.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetUserData();
  }, [handleGetUserData]);

  return (
    <View className="flex-1 bg-background">
      {/* ======= HEADER ====== */}
      <View className="mt-8 p-4 bg-white rounded-lg shadow-lg flex-row justify-between items-center mx-8">
        <View>
          <Text className="text-lg font-poppins-semibold">
            Bom dia,{" "}
            <Text className="font-poppins-semibold color-green">
              {userData?.nome}
            </Text>
          </Text>
          <Text className="mt-2 text-md font-poppins text-gray-600">
            Seja Bem vindo a sua página
          </Text>
        </View>
        <View>
          <ButtonComponent className="bg-green rounded-full py-3 shadow-black shadow-lg  w-14 h-14">
            <FontAwesome5 name="bus" size={22} color="white" />
          </ButtonComponent>
        </View>
      </View>

      {/* ======= CONTENT ====== */}
      <View className="flex flex-row gap-12 justify-center items-center mt-10 mx-8"></View>

      {/* ======= FOOTER (LISTA) ====== */}
      {/* <ElasticList
        snapPoints={["92%"]}
        initialIndex={1}
        contentClassName="p-6"
        dataList={routes}
        estimatedItemSize={92}
        keyExtractor={(item) => String(item.idRota)}
        renderItem={({ item }) => (
          <RotaCard
            item={item}
            onPress={() => {
              handleNavigateDetail(item.idRota, item.nome);
            }}
          />
        )}
      >
        <Text className="font-poppins-bold text-xl">Linhas:</Text>
      </ElasticList> */}
    </View>
  );
}
