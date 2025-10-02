// src/components/elasticList.tsx
import { Rota } from "@/src/assets/types/linhas";
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { ListRenderItem } from "@shopify/flash-list";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type ListProps = {
  children?: ReactNode;
  snapPoints?: Array<string | number>;
  initialIndex?: number;
  onChange?(index: number): void;
  enablePanDownToClose?: boolean;
  contentClassName?: string;
  dataList?: Rota[];
  // NOVOS:
  renderItem?: ListRenderItem<Rota>;
  keyExtractor?: (item: Rota, index: number) => string;
  estimatedItemSize?: number;
  emptyText?: string;
};

const ElasticList = forwardRef<BottomSheet, ListProps>(function List(
  {
    children,
    snapPoints,
    initialIndex = 0,
    onChange,
    enablePanDownToClose = true,
    contentClassName = "flex-1 p-4",
    dataList = [],
    renderItem,
    keyExtractor,
    estimatedItemSize = 80,
    emptyText = "Nenhum item encontrado.",
  },
  ref
) {
  const innerRef = useRef<BottomSheet>(null);
  const sheetRef =
    (ref as React.MutableRefObject<BottomSheet | null>) || innerRef;

  const memoSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  const handleSheetChanges = useCallback(
    (i: number) => {
      onChange?.(i);
    },
    [onChange]
  );

  // Renderer padrão (se não passar um custom)
  const defaultRenderItem: ListRenderItem<Rota> = ({ item }) => (
    <View className="bg-white rounded-xl p-4 border border-black/5">
      <Text className="font-poppins-semibold text-base">{item.nome}</Text>
      <Text className="text-gray-600">
        {item.cidadeNome}/{item.cidadeUf} • {item.periodo} • cap.{" "}
        {item.capacidade}
      </Text>
      <Text className="text-gray-600">
        {item.horaPartida} → {item.horaChegada}{" "}
        {item.ativo ? "• Ativa" : "• Inativa"}
      </Text>
    </View>
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheet
        ref={sheetRef}
        index={initialIndex}
        snapPoints={memoSnapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={enablePanDownToClose}
        enableOverDrag={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        backgroundStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        handleIndicatorStyle={{ backgroundColor: "#ccc" }}
      >
        <BottomSheetView className={contentClassName}>
          {children}

          <BottomSheetFlashList
            data={dataList}
            keyExtractor={keyExtractor ?? ((item) => String(item.idRota))}
            renderItem={renderItem ?? defaultRenderItem}
            estimatedItemSize={estimatedItemSize}
            // padding interno da lista
            contentContainerStyle={{
              paddingTop: 12,
              paddingBottom: 24,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
            ListEmptyComponent={
              <View className="py-5 items-center">
                <Text className="text-gray-500">{emptyText}</Text>
              </View>
            }
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
});

export default ElasticList;
