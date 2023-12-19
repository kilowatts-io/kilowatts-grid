import React from "react";
import { StyleSheet, View } from "react-native";
import { ListItem } from "@rneui/themed";
import formatters from "../common/formatters";
import { FuelType } from "../common/types";
import { FuelTypeIcon } from "./icons";

type GeneratorLiveProps = {
  index: number;
  fuelType: FuelType;
  name: string;
  level: number;
  onPress?: () => void;
};

export const GeneratorLive: React.FC<GeneratorLiveProps> = ({
  index,
  fuelType,
  name,
  level,
  onPress,
}) => (
  <ListItem style={styles.listItemWrapper}>
    <ListItem.Content
      style={styles.liveContainer}
      onPress={onPress}
      testID={`generator-live-${index}`}
    >
      <ListItem.Title>
        <FuelTypeIcon fuelType={fuelType} size={20} />
        <View style={styles.hSpacer} />
        <>{name}</>
      </ListItem.Title>
      <ListItem.Subtitle>{formatters.mw(level)}</ListItem.Subtitle>
    </ListItem.Content>
  </ListItem>
);

type FuelTypeLiveProps = {
  name: FuelType;
  level: number;
};

export const FuelTypeLive: React.FC<FuelTypeLiveProps> = ({ name, level }) => (
  <ListItem>
    <ListItem.Content style={styles.liveContainer}>
      <ListItem.Title>
        <FuelTypeIcon fuelType={name} size={20} />
        <View style={styles.hSpacer} />
        <>{formatters.fuelType(name)}</>
      </ListItem.Title>
      <ListItem.Subtitle>{formatters.mw(level)}</ListItem.Subtitle>
    </ListItem.Content>
  </ListItem>
);

const styles = StyleSheet.create({
  liveContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  hSpacer: {
    width: 10,
  },
  listItemWrapper: {
    width: "100%",
  }
});
