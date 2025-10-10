import {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { ListRenderItem } from "@shopify/flash-list";
import React, { forwardRef, ReactNode, useMemo } from "react";
import { Text, View } from "react-native";
import Loading from "./loading"; // Assumindo que você tem esse componente

type ListProps<T> = {
  children?: ReactNode;
  snapPoints?: Array<string | number>;
  onChange?(index: number): void;
  contentClassName?: string;
  dataList?: T[];
  renderItem?: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  estimatedItemSize?: number;
  emptyText?: string;
};

function ElasticListInner<T>(
  {
    children,
    snapPoints,
    onChange,
    contentClassName = "flex-1 p-4 rounded-t-3xl overflow-hidden",
    dataList = [],
    renderItem,
    keyExtractor,
    estimatedItemSize = 80,
    emptyText = "Nenhum item encontrado.",
  }: ListProps<T>,
  ref: React.Ref<BottomSheetModal>
) {
  const memoSnapPoints = useMemo(() => snapPoints ?? ["50%"], [snapPoints]);

  const defaultRenderItem: ListRenderItem<T> = ({ item }) => (
    <View className="p-4 bg-gray-200 rounded-lg">
      <Text>{JSON.stringify(item)}</Text>
    </View>
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={memoSnapPoints}
      onChange={onChange}
      handleIndicatorStyle={{ backgroundColor: "#ccc" }}
    >
      <BottomSheetView className={contentClassName}>
        {children}
        <BottomSheetFlashList
          data={dataList}
          keyExtractor={
            keyExtractor ??
            ((item: any, idx) => item?.id?.toString() ?? idx.toString())
          }
          renderItem={renderItem ?? defaultRenderItem}
          estimatedItemSize={estimatedItemSize}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8 min-h-[200px]">
              <Loading fullscreen={false} dimBackground={false} />
            </View>
          }
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export const ElasticModalList = forwardRef(ElasticListInner) as <T>(
  p: ListProps<T> & { ref?: React.Ref<BottomSheetModal> }
) => React.ReactElement;
