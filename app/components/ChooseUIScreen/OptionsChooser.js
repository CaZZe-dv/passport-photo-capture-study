import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

function OptionsChooser({
  items = [],
  selected,
  RenderItem,
  onSelect,
  showScrollIndicator,
  prohibitScroll,
}) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const useFlatList = items.length > 10;
  const useScroll = contentHeight > containerHeight;

  const handleSelect = (item) => {
    onSelect?.(item);
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        setContainerHeight(e.nativeEvent.layout.height);
      }}
    >
      {useFlatList ? (
        <FlatList
          data={items}
          keyExtractor={(item, index) => String(item.id ?? index)}
          scrollEnabled={useScroll && !prohibitScroll}
          showsVerticalScrollIndicator={showScrollIndicator}
          renderItem={({ item }) => (
            <RenderItem
              item={item}
              isSelected={selected?.id === item.id}
              onPress={() => handleSelect(item)}
            />
          )}
        />
      ) : (
        <ScrollView
          scrollEnabled={useScroll && !prohibitScroll}
          showsVerticalScrollIndicator={showScrollIndicator}
          contentContainerStyle={styles.content}
          onContentSizeChange={(_, h) => {
            setContentHeight(h);
          }}
        >
          {items.map((item, index) => (
            <RenderItem
              key={String(item.id ?? index)}
              item={item}
              isSelected={selected?.id === item.id}
              onPress={() => handleSelect(item)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 8,
  },
});

export default OptionsChooser;
