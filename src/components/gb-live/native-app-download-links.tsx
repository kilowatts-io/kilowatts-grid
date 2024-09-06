import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "@rneui/themed";

import { urls } from "./terms-and-conditions/urls";

const NativeAppDownloadLinks: React.FC = () => {
  return (
    <Card containerStyle={styles.cardContainer}>
      <Text>Get our app installed to your mobile/tablet</Text>
      <View style={styles.buttonRow}>
        <Button
          title="iOS/Mac"
          size="sm"
          onPress={() => window.location.replace(urls.testLinks.ios)}
        />
        <Button
          title="Android"
          size="sm"
          onPress={() => window.location.replace(urls.testLinks.android)}
        />
      </View>
    </Card>
  );
};

export default NativeAppDownloadLinks;

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cardContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
});
