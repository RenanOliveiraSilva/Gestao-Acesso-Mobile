import { Ponto, Rota } from "@/src/assets/types/linhas";
import { getRouteDetail } from "@/src/services/getRouteDetail"; // deve retornar { info, pontos }
import { showToastTop } from "@/src/utils/showToast";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import ButtonComponent from "../../components/button";
import Loading from "../../components/loading";
import { ElasticModalList } from "../../components/modalList";
import PontoCard from "../../components/pontoCard";

type Markers = { id: number; lat: number; lon: number };
type RotaInfo = Omit<Rota, "pontos">;

export default function LinhaPage() {
  const { id } = useLocalSearchParams();
  const idRoute = useMemo(() => (Array.isArray(id) ? id[0] : id) ?? "", [id]);

  const [loading, setLoading] = useState(false);
  const [rotaInfo, setRotaInfo] = useState<RotaInfo | null>(null);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [markers, setMarkers] = useState<Markers[]>([]);
  const [sheetShown, setSheetShown] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const mapRef = useRef<MapView>(null);

  const buildMarkers = useCallback((data: Ponto[]) => {
    const mks = data.map((p) => ({
      id: p.idPonto,
      lat: p.latitude,
      lon: p.longitude,
    }));
    setMarkers(mks);

    if (mks.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        mks.map((m) => ({ latitude: m.lat, longitude: m.lon })),
        {
          edgePadding: { top: 80, right: 80, bottom: 260, left: 80 },
          animated: true,
        }
      );
    }
  }, []);

  const fetchRouteDetail = useCallback(async () => {
    if (!idRoute) {
      showToastTop("error", "Falha ao obter detalhe da Rota (id ausente).");
      return;
    }
    setLoading(true);
    try {
      const res = await getRouteDetail(idRoute);
      if (!res || (res.pontos?.length ?? 0) === 0) {
        showToastTop(
          "error",
          "Não foi possível localizar os pontos dessa Rota!"
        );
        setPontos([]); // estado da lista
        setMarkers([]);
        setRotaInfo(null);
        return;
      }
      setRotaInfo(res.info);
      setPontos(res.pontos);
      buildMarkers(res.pontos);
    } catch (err) {
      console.error(err);
      showToastTop("error", "Falha ao obter detalhe da Rota.");
    } finally {
      setLoading(false);
    }
  }, [idRoute, buildMarkers]);

  useEffect(() => {
    fetchRouteDetail();
    setSheetShown(false);
  }, [fetchRouteDetail]);

  useEffect(() => {
    if (pontos.length > 0 && !sheetShown) {
      // garante que o ref está montado antes de abrir
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
        setSheetShown(true);
      }, 0);
    }
  }, [pontos, sheetShown]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: -20.584872834699688,
          longitude: -47.865089722008996,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lon }}
          />
        ))}
      </MapView>

      {loading && (
        <View className="flex-1 absolute inset-0 items-center justify-center bg-black/10">
          <Loading
            fullscreen={true}
            dimBackground={false}
            imageSource={require("../../../assets/images/loading-travel.gif")}
          />
        </View>
      )}

      {/* HEADER */}
      <View className="absolute top-10 left-0 right-0 z-30 px-8">
        <View className="p-4 bg-green rounded-lg shadow-lg flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-poppins-semibold color-white">
              {rotaInfo
                ? `${rotaInfo.cidadeNome} - ${rotaInfo.cidadeUf}`
                : "Carregando cidade..."}
            </Text>
            <Text
              className="mt-2 text-md font-poppins color-white w-72"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {rotaInfo
                ? `Detalhes da rota ${rotaInfo.nome}`
                : "Buscando rota..."}
            </Text>
          </View>
          <ButtonComponent
            className="bg-white rounded-full py-3 shadow-black shadow-lg w-14 h-14"
            onPress={() => router.back()}
            disabled={loading}
          >
            <Ionicons name="chevron-back-outline" size={26} color="green" />
          </ButtonComponent>
        </View>
      </View>

      {/* LISTA SOBRE O MAPA */}
      <ElasticModalList
        ref={bottomSheetModalRef}
        snapPoints={["15%", "45%"]}
        initialIndex={1}
        enablePanDownToClose={false}
        dataList={pontos}
        loading={loading}
        renderItem={({ item }) => (
          <PontoCard
            item={item}
            onPress={() => console.log("Ponto selecionado:", item.nomePonto)}
          />
        )}
      >
        <Text className="font-poppins-bold text-xl mb-2">
          {rotaInfo ? `Pontos da rota ${rotaInfo.nome}:` : "Pontos:"}
        </Text>
      </ElasticModalList>
    </GestureHandlerRootView>
  );
}
