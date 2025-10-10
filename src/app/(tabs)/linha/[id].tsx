import { Ponto } from "@/src/assets/types/linhas";
import { getRouteDetail } from "@/src/services/getRouteDetail";
import { showToastTop } from "@/src/utils/showToast";
import { UserStorage } from "@/src/utils/userStorage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import ButtonComponent from "../../components/button";
import { ElasticModalList } from "../../components/elasticList";
import PontoCard from "../../components/pontoCard";

type StoredUser = {
  idColaborador: string | null;
  nome: string | null;
  token: string | null;
  email: string | null;
  role: string | null;
};

type Markers = {
  id: number;
  lat: number;
  lon: number;
};

export default function LinhaPage() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [dataRoute, setDataRoute] = useState<Ponto[]>();
  const [dataMarkers, setDataMarkers] = useState<Markers[]>([]);
  const [userData, setUserData] = useState<StoredUser>({
    idColaborador: null,
    nome: null,
    token: null,
    email: null,
    role: null,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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

  const handleGetRouteDetail = useCallback(async () => {
    setLoading(true);

    try {
      const idRoute = id as string;
      if (!idRoute) {
        showToastTop("error", "Falha ao obter detalhe da Rota.");
        return;
      }

      const data = await getRouteDetail(idRoute);

      if (!data) {
        showToastTop("error", "Falha ao obter detalhe da Rota.");
        return;
      }

      setDataRoute(data);

      getMakers(data);
    } catch (err) {
      console.error(err);

      showToastTop("error", "Falha ao obter detalhe da Rota.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const getMakers = useCallback((data: Ponto[] | undefined) => {
    if (!data) {
      showToastTop("error", "Não foi possível localizar os pontos dessa Rota!");
      return;
    }

    const markers = data.map((item) => ({
      id: item.idPonto,
      lat: item.latitude,
      lon: item.longitude,
    }));

    setDataMarkers(markers);
  }, []);

  useEffect(() => {
    // Apresenta o modal assim que os dados da rota chegarem
    if (dataRoute && dataRoute.length > 0) {
      handlePresentModal();
    }
  }, [dataRoute, handlePresentModal]);

  useEffect(() => {
    handleGetUserData();
    handleGetRouteDetail();
  }, [handleGetUserData, handleGetRouteDetail]);

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: -20.584872834699688,
            longitude: -47.865089722008996,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled
          zoomEnabled
          pitchEnabled
          rotateEnabled
        >
          {dataMarkers.map((item) => (
            <Marker
              key={item.id}
              coordinate={{ latitude: item.lat, longitude: item.lon }}
            />
          ))}
        </MapView>

        {/* HEADER SOBRE O MAPA */}
        <View className="absolute top-10 left-0 right-0 z-30 px-8">
          <View className="p-4 bg-white rounded-lg shadow-lg flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-poppins-semibold">
                Bom dia,{" "}
                <Text className="font-poppins-semibold color-green">
                  {userData?.nome}
                </Text>
              </Text>
              <Text className="mt-2 text-md font-poppins text-gray-600">
                Seja Bem vindo à sua página
              </Text>
            </View>
            <ButtonComponent className="bg-green rounded-full py-3 shadow-black shadow-lg w-14 h-14">
              <FontAwesome5 name="bus" size={22} color="white" />
            </ButtonComponent>
          </View>

          <ElasticModalList
            ref={bottomSheetModalRef}
            snapPoints={["85%"]}
            dataList={dataRoute}
            renderItem={({ item }) => (
              <PontoCard
                item={item}
                onPress={() =>
                  console.log("Ponto selecionado:", item.nomePonto)
                }
              />
            )}
          >
            <Text className="font-poppins-bold text-xl mb-2">Pontos:</Text>
          </ElasticModalList>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
