import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { ListRenderItem } from "@shopify/flash-list";
import React, {
  forwardRef,
  JSX,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Loading from "./loading";

type ListProps<T> = {
  children?: ReactNode;
  snapPoints?: Array<string | number>;
  initialIndex?: number;
  onChange?(index: number): void;
  enablePanDownToClose?: boolean;
  contentClassName?: string;
  dataList?: T[];
  renderItem?: ListRenderItem<T>;
  enableOverDrag?: boolean;
  enableHandlePanningGesture?: boolean;
  enableContentPanningGesture?: boolean;
  keyExtractor?: (item: T, index: number) => string;
  estimatedItemSize?: number;
  emptyText?: string;
};

function ElasticListInner<T>(
  {
    children,
    snapPoints,
    initialIndex = 0,
    onChange,
    enablePanDownToClose = false,
    contentClassName = "",
    dataList = [],
    renderItem,
    enableOverDrag = true,
    enableHandlePanningGesture = true,
    enableContentPanningGesture = true,
    keyExtractor,
    estimatedItemSize = 80,
    emptyText = "Nenhum item encontrado.",
  }: ListProps<T>,
  ref: React.Ref<BottomSheet>
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

  const defaultRenderItem: ListRenderItem<T> = ({ item }) => (
    <View className="bg-white rounded-xl p-4 border border-black/5">
      <Text className="text-xs text-gray-700">
        {typeof item === "object" ? JSON.stringify(item) : String(item)}
      </Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={memoSnapPoints}
        handleIndicatorStyle={{ backgroundColor: "#ccc" }}
        detached={true}
        index={initialIndex}
        onChange={handleSheetChanges}
        enableOverDrag={false}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={true}
        activeOffsetY={[-10, 10]} // ignora pequenos toques (libera o mapa)
        backgroundStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <BottomSheetView className={contentClassName}>
          {children}

          <BottomSheetFlashList
            data={dataList}
            keyExtractor={
              keyExtractor ??
              ((item: any, idx) => String(item?.idRota ?? item?.id ?? idx))
            }
            renderItem={renderItem ?? defaultRenderItem}
            estimatedItemSize={estimatedItemSize}
            contentContainerStyle={{
              paddingTop: 12,
              paddingBottom: 24,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 32,
                  minHeight: 300,
                }}
              >
                <Loading fullscreen={false} dimBackground={false} />
              </View>
            }
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const ElasticList = forwardRef(ElasticListInner) as <T>(
  p: ListProps<T> & { ref?: React.Ref<BottomSheet> }
) => JSX.Element;

export default ElasticList;
