// src/components/modalList.tsx
import {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { ListRenderItem } from "@shopify/flash-list";
import React, { forwardRef, ReactNode, useMemo } from "react";
import { Text, View } from "react-native";
import Loading from "./loading";

type ModalListProps = {
  children?: ReactNode;
  snapPoints?: Array<string | number>;
  onChange?(index: number): void;
  contentClassName?: string;
  dataList?: any[];
  renderItem?: ListRenderItem<any>;
  keyExtractor?: (item: any, index: number) => string;
  estimatedItemSize?: number;
  emptyText?: string;
  loading?: boolean;
  initialIndex?: number;
  onDismiss?: () => void;
  enablePanDownToClose?: boolean;
};

export const ElasticModalList = forwardRef<BottomSheetModal, ModalListProps>(
  function ElasticModalList(
    {
      children,
      snapPoints,
      onChange,
      contentClassName = "flex-1 p-4 rounded-t-3xl",
      dataList = [],
      renderItem,
      keyExtractor,
      estimatedItemSize = 80,
      emptyText = "Nenhum item encontrado.",
      loading = false,
      initialIndex = 0,
      onDismiss,
      enablePanDownToClose = true,
    },
    ref
  ) {
    const memoSnapPoints = useMemo(() => snapPoints ?? ["50%"], [snapPoints]);

    const defaultRenderItem: ListRenderItem<any> = ({ item }) => (
      <View className="p-4 bg-gray-200 rounded-lg">
        <Text>{JSON.stringify(item)}</Text>
      </View>
    );

    const defaultKeyExtractor =
      keyExtractor ??
      ((item: any, idx) => item?.id?.toString?.() ?? String(idx));

    return (
      <BottomSheetModal
        ref={ref}
        index={initialIndex}
        snapPoints={memoSnapPoints}
        onChange={onChange}
        onDismiss={onDismiss}
        enablePanDownToClose={enablePanDownToClose}
        handleIndicatorStyle={{ backgroundColor: "#ccc" }}
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="interactive"
      >
        <BottomSheetView className={contentClassName}>
          <BottomSheetFlashList
            data={dataList}
            keyExtractor={defaultKeyExtractor}
            renderItem={renderItem ?? defaultRenderItem}
            estimatedItemSize={estimatedItemSize}
            ListHeaderComponent={children ? <View>{children}</View> : null}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <View className="items-center justify-center p-8 min-h-[200px]">
                {loading ? (
                  <Loading fullscreen={false} dimBackground={false} />
                ) : (
                  <Text className="text-gray-500">{emptyText}</Text>
                )}
              </View>
            }
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
