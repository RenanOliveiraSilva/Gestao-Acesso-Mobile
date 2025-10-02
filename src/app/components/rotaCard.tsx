import Feather from "@expo/vector-icons/Feather";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { Rota } from "@/src/assets/types/linhas";

export default function RotaCard({
  item,
  onPress,
}: {
  item: Rota;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-primary/10 flex flex-row mb-3 border border-primary rounded-md"
    >
      <View className="h-16 w-20 p-2 flex items-center justify-center border-r border-primary">
        <Image
          source={require("../../assets/images/logoIPUA.png")}
          className="auto shadow-lg shadow-black/50 h-10 w-12"
        />
      </View>

      <View className="flex-1 flex flex-row justify-between">
        <View className="h-full p-2 ml-1 flex flex-col justify-center">
          <Text className="font-poppins-bold text-sm text-black">
            {item?.nome}
          </Text>
          <Text className="font-poppins-semibold text-sm text-[#505050]">
            {item?.cidadeNome}
          </Text>
        </View>

        <View className="h-full w-fit flex justify-center items-center px-5">
          <Feather name="sun" size={30} color="#038C4C" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
