import { Ponto } from "@/src/assets/types/linhas";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Text, TouchableOpacity, View } from "react-native";

export default function PontoCard({
  item,
  onPress,
}: {
  item: Ponto;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-primary/10 flex flex-row mb-3 border border-primary rounded-md"
    >
      <View className="h-16 w-20 p-2 flex items-center justify-center border-r border-primary">
        <FontAwesome5 name="map-marker-alt" size={24} color="#038C4C" />
      </View>

      <View className="flex-1 flex flex-row justify-between">
        <View className="h-full flex-1 p-2 ml-1 flex flex-col justify-center">
          <Text
            className="font-poppins-bold text-sm text-black"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item?.nomePonto}
          </Text>
          <Text
            className="font-poppins-semibold text-sm text-[#505050]"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item?.endereco}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
