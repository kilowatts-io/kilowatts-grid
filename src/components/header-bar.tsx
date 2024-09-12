import { useRouter } from "expo-router";
import { Appbar } from "react-native-paper";
import SvgZoomMapButtons from "./svg-map/zoom-buttons";

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