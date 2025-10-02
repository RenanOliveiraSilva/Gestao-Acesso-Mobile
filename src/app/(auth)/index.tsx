import { autenticateUser } from "@/src/services/auth";
import { showToastTop } from "@/src/utils/showToast";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SingInPage() {
  const [hidePass, setHidePass] = useState(true);
  const [matricula, setMatricula] = useState("");
  const [loading, setLoading] = useState(false);
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!matricula || !senha) {
      showToastTop("info", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const isSuccess = await autenticateUser(matricula, senha);

      if (isSuccess) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Erro inesperado no handleLogin:", error);
      showToastTop("error", "Ocorreu um erro crítico no app.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 px-6 py-10">
      {/* ÍCONE DO ÔNIBUS */}

      <View className="w-20 h-20 px-2 rounded-xl py-5 items-center justify-center mb-10 bg-primary">
        <Image
          source={require("../../assets/images/iconBus.png")}
          className="w-full h-full"
        />
      </View>

      {/* SLOGAN */}

      <View className="w-full h-fit mb-20">
        <Text className="font-poppins-bold text-xl">Entre com sua conta</Text>
        <Text className="font-poppins-bold text-xl">
          e descubra o poder da{" "}
          <Text className="text-primary">tecnologia!</Text>
        </Text>
      </View>

      {/* LOGIN */}
      <View className="flex-1 space-y-2 pt-12">
        <Text className="font-poppins-semibold text-xl mb-3">Matrícula</Text>
        <TextInput
          className="bg-white/0 border-2 border-primary rounded-xl p-4 mb-10"
          placeholder="Digite sua matrícula"
          keyboardType="numeric"
          value={matricula}
          onChangeText={setMatricula}
        />
        <Text className="font-poppins-semibold text-xl mb-3">Senha</Text>
        <View className="relative">
          <TextInput
            className="bg-white/0 border-2 border-primary rounded-xl p-4 mb-10 pr-10"
            placeholder="Digite sua senha"
            secureTextEntry={hidePass}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            className="absolute right-4 top-[13px]"
            onPress={() => setHidePass(!hidePass)}
          >
            <FontAwesome6 name={hidePass ? "eye-slash" : "eye"} size={18} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="w-full bg-primary rounded-xl p-4 mt-10 items-center justify-center shadow-lg shadow-black/50"
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">ENTRAR</Text>
          )}
        </TouchableOpacity>

        <View className="w-full h-fit mt-10 items-center justify-center">
          <Text className="text-lg font-bold mb-1">Problemas com conta?</Text>
          <Text className="text-lg font-extrabold text-primary">
            Aperte Aqui
          </Text>
        </View>
      </View>
    </View>
  );
}
