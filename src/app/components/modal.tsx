import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ModalComponent() {
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.container}>
      {/* MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Ler Código De Barras</Text>
              <Pressable onPress={() => setVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#E53935" />
              </Pressable>
            </View>

            {/* Corpo (simulando câmera / leitor) */}
            <View style={styles.cameraPreview}>
              {/* aqui você pode usar o componente da câmera futuramente */}
            </View>

            {/* Botão Confirmar */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.confirmText}>CONFIRMAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  openButton: {
    backgroundColor: "#007E33",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  openButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 10, // sombra no Android
    shadowColor: "#000", // sombra no iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  cameraPreview: {
    width: "80%",
    aspectRatio: 3 / 4,
    backgroundColor: "#000",
    borderRadius: 8,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#007E33",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: "stretch",
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});
