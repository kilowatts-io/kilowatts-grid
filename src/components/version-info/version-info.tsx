// text compoment which renders version information from expo-updates
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import * as Updates from "expo-updates";

const VersionInfo: React.FC = () => {
  if (__DEV__) {
    return (
      <View style={styles.view}>
        <Text>Development Mode</Text>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <Text>
        {`App Version ${Updates.runtimeVersion} ${Updates.isEmbeddedLaunch ? "" : "(OTA Upgrade)"}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingTop: 20,
  },
});

export default VersionInfo;
