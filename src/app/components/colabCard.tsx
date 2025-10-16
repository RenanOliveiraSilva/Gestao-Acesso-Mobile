import { Ponto } from "@/src/assets/types/linhas";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, TouchableOpacity, View } from "react-native";

interface Colab {
  nome: string;
  ponto: string;
}

export default function ColabCard({
  item,
  onPress,
}: {
  item: Colab;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-primary/10 flex flex-row mb-3 border border-primary rounded-md"
    >
      <View className="h-16 w-20 p-2 flex items-center justify-center border-r border-primary">
        <FontAwesome name="user-circle-o" size={24} color="#038C4C" />
      </View>

      <View className="flex-1 flex flex-row justify-between">
        <View className="h-full flex-1 p-2 ml-1 flex flex-col justify-center">
          <Text
            className="font-poppins-bold text-sm text-black"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Colaborador A - 52963
          </Text>
          <Text
            className="font-poppins-semibold text-sm text-[#505050]"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Ponto a - DIURNO
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
