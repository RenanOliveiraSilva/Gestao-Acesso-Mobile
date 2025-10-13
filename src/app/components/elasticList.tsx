// src/components/elasticList.tsx
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
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
  fixedHeaderClassName?: string;
  headerInsideClassName?: string;
  dataList?: T[];
  renderItem?: ListRenderItem<T>;
  enableOverDrag?: boolean;
  enableHandlePanningGesture?: boolean;
  enableContentPanningGesture?: boolean;
  keyExtractor?: (item: T, index: number) => string;
  estimatedItemSize?: number;
  emptyText?: string;
  detached?: boolean;
  headerInsideList?: boolean;
  backgroundStyle?: any;
};

function ElasticListInner<T>(
  {
    children,
    snapPoints = ["95%"],
    initialIndex = 0,
    onChange,
    enablePanDownToClose = false,
    fixedHeaderClassName = "p-4 rounded-t-3xl",
    headerInsideClassName = "px-4 pt-4 pb-2", // sem flex-1!
    dataList = [],
    renderItem,
    enableOverDrag = true,
    enableHandlePanningGesture = true, // deixe habilitado p/ scroll suave
    enableContentPanningGesture = true, // deixe habilitado p/ scroll suave
    keyExtractor,
    estimatedItemSize = 72,
    emptyText = "Nenhum item encontrado.",
    detached = false,
    headerInsideList = true,
    backgroundStyle,
  }: ListProps<T>,
  ref: React.Ref<BottomSheet>
) {
  const innerRef = useRef<BottomSheet>(null);
  const sheetRef =
    (ref as React.MutableRefObject<BottomSheet | null>) || innerRef;

  const memoSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  const handleSheetChanges = useCallback(
    (i: number) => onChange?.(i),
    [onChange]
  );

  const defaultRenderItem: ListRenderItem<T> = ({ item }) => (
    <View className="bg-white rounded-xl p-4 border border-black/5">
      <Text className="text-xs text-gray-700">
        {typeof item === "object" ? JSON.stringify(item) : String(item)}
      </Text>
    </View>
  );

  const listHeader =
    headerInsideList && children ? (
      <View className={headerInsideClassName}>{children}</View>
    ) : null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={memoSnapPoints}
        index={initialIndex}
        onChange={handleSheetChanges}
        enableOverDrag={enableOverDrag}
        enableHandlePanningGesture={enableHandlePanningGesture}
        enableContentPanningGesture={enableContentPanningGesture}
        enablePanDownToClose={enablePanDownToClose}
        detached={detached}
        backgroundStyle={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          ...(backgroundStyle ?? {}),
        }}
      >
        {/* Header FIXO (se você NÃO quiser que role junto) */}
        {!headerInsideList && children ? (
          <BottomSheetView className={fixedHeaderClassName}>
            {children}
          </BottomSheetView>
        ) : null}

        {/* Lista deve ser FILHA DIRETA do BottomSheet */}
        <BottomSheetFlashList
          data={dataList}
          keyExtractor={
            keyExtractor ??
            ((item: any, idx) => String(item?.idRota ?? item?.id ?? idx))
          }
          renderItem={renderItem ?? defaultRenderItem}
          estimatedItemSize={estimatedItemSize}
          focusHook={useFocusEffect}
          contentContainerStyle={{
            paddingTop: headerInsideList ? 4 : 0,
            paddingBottom: 50,
            paddingHorizontal: 16,
          }}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <View
              style={{
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
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const ElasticList = forwardRef(ElasticListInner) as <T>(
  p: ListProps<T> & { ref?: React.Ref<BottomSheet> }
) => JSX.Element;

export default ElasticList;
