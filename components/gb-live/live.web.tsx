import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "@rneui/themed";

import { useGbLive } from "../../state/gb/hooks";

import { GbLiveBottomSheetTabs } from "./bottom-sheet-tabs/tabs";
import { WithTermsAndConditionsAccepted } from "./terms-and-conditions/acceptance";
import { urls } from "./terms-and-conditions/urls";

const NativeAppDownloadLinks: React.FC = () => {
  return (
    <Card containerStyle={styles.cardContainer}>
      <Text>
        To view our map visualisation, you need to download the app, currently
        available in beta/preview for testing.
      </Text>
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

export const GbLive = () => {
  useGbLive();
  return (
    <WithTermsAndConditionsAccepted>
      <>
        <NativeAppDownloadLinks />
        <GbLiveBottomSheetTabs />
      </>
    </WithTermsAndConditionsAccepted>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  cardContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column"
  }
});
