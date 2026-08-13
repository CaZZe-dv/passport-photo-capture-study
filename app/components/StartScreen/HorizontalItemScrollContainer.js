import { useState, useRef, useEffect } from "react";
import { StyleSheet, FlatList, View, Pressable } from "react-native";
import { COLORS } from "../../constants/Colors";

function HorizontalItemScrollContainer({
  items,
  RenderItem,
  autoScroll = false,
  interval = 3000,
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    if (!autoScroll || containerWidth === 0) return;

    intervalRef.current = setInterval(() => {
      const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, interval);

    return () => clearInterval(intervalRef.current);
  }, [autoScroll, containerWidth, activeIndex]);

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      {containerWidth > 0 && (
        <>
          <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={items}
            keyExtractor={(item) => String(item.id)}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / containerWidth,
              );
              setActiveIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={{ width: containerWidth - 24, margin: 12 }}>
                <RenderItem item={item} />
              </View>
            )}
          />

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {items.map((_, index) => (
              <Pressable
                onPress={() =>
                  flatListRef.current?.scrollToIndex({ index, animated: true })
                }
                key={index}
              >
                <View
                  style={[
                    styles.dot,
                    index === activeIndex && styles.activeDot,
                  ]}
                />
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

export default HorizontalItemScrollContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.overlay,
    marginHorizontal: 4,
  },
  activeDot: {
    transform: [{ scale: 1.4 }],
    backgroundColor: COLORS.primary,
  },
});
