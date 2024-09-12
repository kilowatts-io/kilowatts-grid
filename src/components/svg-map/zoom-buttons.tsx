import { GB_MAP_CENTER } from "@/src/atoms/svg-map";
import { useDataContext } from "@/src/contexts/data";
import {
  DEFAULT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  useSvgMapContext,
  ZOOM_INC,
} from "@/src/contexts/svg-map";
import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

const ICON_BUTTON_SIZE = 20;

const SvgZoomMapButtons: React.FC = () => {
  const d = useDataContext();
  const ctx = useSvgMapContext();
  return (
    <View style={styles.buttonWrapper}>
      <IconButton
      size={ICON_BUTTON_SIZE}
      icon="refresh"
      onPress={() => {
        d.refetch();
        ctx.zoom.value = DEFAULT_ZOOM
        ctx.centerLat.value = GB_MAP_CENTER.lat
        ctx.centerLng.value = GB_MAP_CENTER.lng
      }}
      />
      <IconButton
      size={ICON_BUTTON_SIZE}
      icon="magnify-minus"
      onPress={() =>
        (ctx.zoom.value = Math.max(ctx.zoom.value - ZOOM_INC, MIN_ZOOM))
      }
      />
      <IconButton
      size={ICON_BUTTON_SIZE}
      icon="magnify-plus"
      onPress={() =>
        (ctx.zoom.value = Math.min(ctx.zoom.value + ZOOM_INC, MAX_ZOOM))
      }
      />
    </View>
  );
};

export default SvgZoomMapButtons;

const styles = StyleSheet.create({
  buttonText: {
    color: "black",
  },
  button: {
    width: 25,
    height: 25,
    borderColor: "darkgrey",
    borderWidth: 1,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
  },
});
