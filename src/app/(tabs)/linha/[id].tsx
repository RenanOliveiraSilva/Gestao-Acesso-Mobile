import { Ponto } from "@/src/assets/types/linhas";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import ButtonComponent from "../../components/button";
import ElasticList from "../../components/elasticList";
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

  // Suas funções (handleGetUserData, handleGetRouteDetail, getMakers) continuam iguais...
  const handleGetUserData = useCallback(async () => {
    /* ...código sem alteração... */
  }, []);
  const handleGetRouteDetail = useCallback(async () => {
    /* ...código sem alteração... */
  }, []);
  const getMakers = useCallback((data: Ponto[] | undefined) => {
    /* ...código sem alteração... */
  }, []);

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    handleGetUserData();
    handleGetRouteDetail();
  }, [handleGetUserData, handleGetRouteDetail]);

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1">
        {/* MAPA PREENCHENDO TUDO */}
        <MapView
          style={StyleSheet.absoluteFillObject}
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
        </View>

        {/* BOTTOMSHEET SOBRE O MAPA (NÃO EMPURRA O LAYOUT) */}
        <View
          pointerEvents="box-none"
          style={StyleSheet.absoluteFillObject}
          className="z-40"
        >
          <ElasticList
            ref={bottomSheetRef}
            snapPoints={["100%", "20%"]}
            initialIndex={1}
            contentClassName="p-6"
            dataList={dataRoute}
            estimatedItemSize={92}
            keyExtractor={(item) => String(item.idPonto)}
            renderItem={({ item }) => (
              <PontoCard
                item={item}
                onPress={() => {
                  console.log("Ponto selecionado:", item.nomePonto);
                }}
              />
            )}
          >
            <Text className="font-poppins-bold text-xl mb-2">Pontos:</Text>
          </ElasticList>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
