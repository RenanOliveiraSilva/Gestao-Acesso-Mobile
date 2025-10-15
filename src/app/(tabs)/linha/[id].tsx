import { Ponto, Rota } from "@/src/assets/types/linhas";
import { getRouteDetail } from "@/src/services/getRouteDetail"; // deve retornar { info, pontos }
import { showToastTop } from "@/src/utils/showToast";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, Polyline } from "react-native-maps";
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
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [sheetShown, setSheetShown] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const mapRef = useRef<MapView>(null);

  function decodePolyline(encoded: string) {
    const points: { latitude: number; longitude: number }[] = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  }

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

  const fetchGoogleDirections = useCallback(async (points: Ponto[]) => {
    if (points.length < 2) return;

    try {
      // Origem e destino
      const origin = `${points[0].latitude},${points[0].longitude}`;
      const destination = `${points[points.length - 1].latitude},${points[points.length - 1].longitude}`;

      // Waypoints intermediários (se houver mais de 2 pontos)
      const waypoints =
        points.length > 2
          ? points
              .slice(1, -1)
              .map((p) => `${p.latitude},${p.longitude}`)
              .join("|")
          : "";

      // URL da Directions API
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${
        waypoints ? `&waypoints=${waypoints}` : ""
      }&key=${process.env.EXPO_PUBLIC_MAPS_API_KEY}&mode=driving`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "OK" || !data.routes?.length) {
        console.error("Google Directions API error:", data);
        showToastTop("error", "Não foi possível traçar a rota.");
        return;
      }

      // Extrair os pontos do polyline (Google retorna codificado)
      const encodedPolyline = data.routes[0].overview_polyline.points;

      // Decodificar polyline → coordenadas [ { latitude, longitude } ]
      const decodedCoords = decodePolyline(encodedPolyline);
      setRouteCoords(decodedCoords);
    } catch (err) {
      console.error("Erro ao buscar rota Google:", err);
      showToastTop("error", "Falha ao conectar ao servidor de rotas.");
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
        setPontos([]);
        setMarkers([]);
        setRotaInfo(null);
        setRouteCoords([]);
        return;
      }
      setRotaInfo(res.info);
      setPontos(res.pontos);
      buildMarkers(res.pontos);
      fetchGoogleDirections(res.pontos);
    } catch (err) {
      console.error(err);
      showToastTop("error", "Falha ao obter detalhe da Rota.");
    } finally {
      setLoading(false);
    }
  }, [idRoute, buildMarkers, fetchGoogleDirections]);

  useEffect(() => {
    fetchRouteDetail();
    setSheetShown(false);
  }, [fetchRouteDetail]);

  useEffect(() => {
    if (pontos.length > 0 && !sheetShown) {
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
        provider="google"
        initialRegion={{
          latitude: -20.584872834699688,
          longitude: -47.865089722008996,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
      >
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#00B140"
            strokeWidth={6}
            lineCap="round"
            lineJoin="round"
          />
        )}
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

      <ElasticModalList
        ref={bottomSheetModalRef}
        snapPoints={["15%", "35%"]}
        initialIndex={2}
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
        <Text className="font-poppins-bold text-xl mb-2">Pontos da Rota:</Text>
      </ElasticModalList>
    </GestureHandlerRootView>
  );
}
