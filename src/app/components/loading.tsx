import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LoadingProps = {
  fullscreen?: boolean;
  message?: string;
  size?: number;
  dimBackground?: boolean;
};

export function Loading({
  fullscreen = true,
  message = "Carregando...",
  size = 140,
  dimBackground = true,
}: LoadingProps) {
  return (
    <View
      style={[
        styles.container,
        fullscreen && styles.fullscreen,
        dimBackground && styles.dim,
      ]}
    >
      <View style={styles.box}>
        <Image
          source={require("../../assets/images/loading-bus.gif")}
          style={{ width: size, height: size }}
          contentFit="contain"
          autoplay
          transition={100}
        />
      </View>
    </View>
  );
}

// Versão simplificada inline (se quiser usar dentro de layouts menores)
export function InlineLoading({
  message = "Carregando...",
}: {
  message?: string;
}) {
  return (
    <View style={styles.inline}>
      <ActivityIndicator size="small" color="#038C3E" />
      <Text style={styles.inlineText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    position: "absolute",
    inset: 0,
    zIndex: 999,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  dim: {
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  text: {
    marginTop: 4,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#222",
  },
});

export default Loading;
