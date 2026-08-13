import { useState, useRef } from "react";
import { Animated } from "react-native";
import IconButton from "../ui/IconButton";

function SwitchableIconButton({
  iconOne,
  iconTwo,
  IconComponentOne,
  IconComponentTwo,
  onSwap,
  ...rest
}) {
  const [switched, setSwitched] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  function switchIconHandler() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setSwitched((prev) => !prev);
      onSwap?.(switched);
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.85,
          useNativeDriver: true,
          friction: 6,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 4,
        }),
      ]).start();

      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start();
    });
  }

  const currentIcon = switched ? iconTwo : iconOne;
  const currentIconItem = switched ? IconComponentOne : IconComponentTwo;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <IconButton
        iconName={currentIcon}
        IconItem={currentIconItem}
        onPress={switchIconHandler}
        {...rest}
      />
    </Animated.View>
  );
}

export default SwitchableIconButton;
