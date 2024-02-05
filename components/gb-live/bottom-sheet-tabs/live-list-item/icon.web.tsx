import React from "react";
import { View, StyleSheet } from "react-native";
import {
  LIST_ICON_DIMS,
} from "../../icons/list-icons";

export const IconView = () => <View style={styles.icon} />;

export const IconViewEmpty = () => <View style={styles.icon} />;

const styles = StyleSheet.create({
  icon: {
    ...LIST_ICON_DIMS,
  },
});
