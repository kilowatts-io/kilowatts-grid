import React from "react";
import MapView, { Marker } from "react-native-maps";
import { UnitGroup } from "../common/types";
import log from "../services/log";
import { StyleSheet } from "react-native";

type UnitGroupMapProps = {
  ug: UnitGroup;
};

export const UnitGroupMap: React.FC<UnitGroupMapProps> = ({ ug }) => {
  log.debug(`UnitGroupMap: ${ug.details.name}`);
  const coordinate = {
    latitude: ug.details.coords.lat,
    longitude: ug.details.coords.lng,
  };
  return (
    <MapView
      style={styles.mapCardContainer}
      initialRegion={{
        ...coordinate,
        latitudeDelta: 0.0922 * 15,
        longitudeDelta: 0.0421 * 15,
      }}
    >
      <Marker
        coordinate={coordinate}
        title={ug.details.name}
        description={ug.details.name}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  mapCardContainer: {
    height: 300,
  },
});
