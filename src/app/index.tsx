import { router } from "expo-router";
import { Image, ImageBackground, Text, View } from "react-native";
import ButtonComponent from "./components/button";

export default function Index() {
  const handleReplaceRouter = () => {
    router.replace("/(auth)");
  };

  return (
    <ImageBackground
      source={require("../assets/images/backgroundHome.png")}
      className="flex-1 p-0 m-0 bg-primary/30 py-20"
      resizeMode="cover"
    >
      <View className="w-full flex-row justify-between items-start p-0 my-10">
        <Image
          source={require("../assets/images/imageRoute.png")}
          className="auto shadow-lg shadow-black/50"
        />
        <Image
          source={require("../assets/images/semiCircle.png")}
          className="auto shadow-lg shadow-black/50"
        />
      </View>

      <View className="footer w-full h-fit items-end justify-end absolute bottom-28">
        <View className="w-full items-center justify-center relative">
          <Text className="text-white font-poppins-bold text-2xl text-center">
            Conectando colaboradores ao trabalho com eficiência.
          </Text>

          <Image
            source={require("../assets/images/homeElement.png")}
            className="w-32 h-16 absolute right-0 top-8"
            resizeMode="contain"
          />
        </View>
        <View className="w-full h-fit px-10">
          <ButtonComponent
            className="bg-white rounded-full py-3 mt-20 shadow-lg shadow-black/50"
            onPress={handleReplaceRouter}
          >
            <Text className="text-green font-bold text-xl uppercase">
              COMEÇAR
            </Text>
          </ButtonComponent>
        </View>
      </View>
    </ImageBackground>
  );
}
