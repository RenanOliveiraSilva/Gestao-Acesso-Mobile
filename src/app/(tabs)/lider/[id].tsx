import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ButtonComponent from "../../components/button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import ElasticList from "../../components/elasticList";
import { useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import ColabCard from "../../components/colabCard";

export default function liderPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const colaboradores = [
    {
      nome: "Colaborador A",
      matricula: "52963",
      ponto: "Ponto A",
      turno: "DIURNO",
    },
    {
      nome: "Colaborador B",
      matricula: "52964",
      ponto: "Ponto B",
      turno: "NOTURNO",
    },
    {
      nome: "Colaborador C",
      matricula: "52965",
      ponto: "Ponto C",
      turno: "DIURNO",
    },
  ];

  const handleReplaceRouter = () => {
    router.replace("/(auth)");
  };

  const showModal = () => {
    try {
      setIsModalVisible(true);
    } catch (err) {
      console.log(err);
    }
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <View className="flex-1 bg-background">
      {/* ======= HEADER ====== */}
      <View className="p-4 mx-4 mt-8 bg-green rounded-lg shadow-lg flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-poppins-semibold color-white">
            TEXTO 1
          </Text>
          <Text
            className="mt-2 text-md font-poppins color-white w-72"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            TEXTO 2
          </Text>
        </View>
        <ButtonComponent
          className="bg-white rounded-full py-3 shadow-black shadow-lg w-14 h-14"
          // onPress={() => router.back()}
          // disabled={loading}
        >
          <Ionicons name="chevron-back-outline" size={26} color="green" />
        </ButtonComponent>
      </View>

      {/* ======= CONTENT ====== */}
      <View className="flex flex-row gap-12 justify-center items-center mt-10 mx-8">
        <TouchableOpacity onPress={() => console.log("Teste")}>
          <View className="bg-cardBg flex items-center justify-center rounded-xl px-2 py-6">
            <MaterialCommunityIcons
              name="barcode-scan"
              size={56}
              color="#038C4C"
            />
            <View className="w-32">
              <Text className="text-center mt-4 text-md font-poppins-semibold text-black">
                Escanear
              </Text>
              <Text className="text-center text-md font-poppins-semibold text-black">
                Crachá
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View className="bg-cardBg flex items-center justify-center rounded-xl px-2 py-6">
            <FontAwesome name="id-card" size={56} color="#038C4C" />
            <View className="w-32">
              <Text className="text-center mt-4 text-md font-poppins-semibold text-black">
                Informar
              </Text>
              <Text className="text-center text-md font-poppins-semibold text-black">
                Matrícula
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* ======= FOOTER (LISTA) ====== */}
      <ElasticList
        ref={bottomSheetRef}
        snapPoints={["95%"]}
        initialIndex={1}
        dataList={colaboradores}
        estimatedItemSize={92}
        enableHandlePanningGesture={false}
        enableOverDrag={false}
        enableContentPanningGesture={false}
        enablePanDownToClose={false}
        keyExtractor={(item) => String(item.matricula)}
        renderItem={({ item }) => <ColabCard item={item} />}
        headerInsideList={true}
      >
        <Text className="font-poppins-bold text-xl pb-2">Colaboradores:</Text>
      </ElasticList>
    </View>
  );
}
