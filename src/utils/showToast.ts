import Toast from "react-native-toast-message";

export const showToastTop = (
  type: "success" | "error" | "info",
  title: string
) => {
  Toast.show({
    type: type,
    text1: title,
    position: "top",
    topOffset: 50, // distância do topo
    visibilityTime: 3000,
  });
};
