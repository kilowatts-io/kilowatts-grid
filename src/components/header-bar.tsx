import { useRouter } from "expo-router";
import { Appbar, IconButton } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { GB_MAP_CENTER } from "../atoms/svg-map";
import { useDataContext } from "../contexts/data";
import { useSvgMapContext, DEFAULT_ZOOM, ZOOM_INC, MIN_ZOOM, MAX_ZOOM } from "../contexts/svg-map";


export const ICON_BUTTON_SIZE = 15;


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


interface HeaderBarProps {
  title: string;
  backUrl?: string;
  children?: React.ReactNode;
  hidePrivacy?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  backUrl,
  children,
  hidePrivacy
}) => {
  const router = useRouter();
  return (
    <Appbar.Header>

      {backUrl && (
        <Appbar.BackAction onPress={() => router.push(backUrl as any)} />
      )}
      <Appbar.Content title={title} />
      {
        !hidePrivacy && (
          <Appbar.Action
            size={ICON_BUTTON_SIZE}
            icon="information-outline"
            onPress={() => router.push("/privacy")}
          />
        )
      }
      {children}
    </Appbar.Header>
  );
};


export const MapScreenHeaderBar: React.FC<HeaderBarProps> = (p) => (
  <HeaderBar {...p}>
    <SvgZoomMapButtons />
  </HeaderBar>
);


export const ListScreenHeaderBar: React.FC<HeaderBarProps & {
  mapUrl: string;
}> = (p) => {
  const router = useRouter();
  return (
    <HeaderBar {...p} >
      <Appbar.Action
        icon="map"
        onPress={() => router.push(p.mapUrl as any)}
      />
      </HeaderBar>
  );
}

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
    gap: 0
  },
});
