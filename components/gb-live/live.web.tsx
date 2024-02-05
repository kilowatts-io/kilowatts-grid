import React from "react";
import { GbLiveBottomSheetTabs } from "./bottom-sheet-tabs/tabs";
import { WithTermsAndConditionsAccepted } from "./terms-and-conditions/acceptance";
import { useGbLive } from "../../state/gb/hooks";
import { Card, Button, Text } from "@rneui/themed";
import { View, StyleSheet } from "react-native";
import { urls } from "./terms-and-conditions/urls";

const NativeAppDownloadLinks: React.FC = () => {
  return (
    <Card containerStyle={styles.cardContainer}>
      <Text>To view our map visualisation, you need to download the app, currently available in beta/preview for testing.</Text>
      {/* <View style={styles.buttonRow}>
        <Button title="iOS/Mac" size='sm' onPress={() => window.location.replace(urls.testLinks.ios)}/>
        <Button title="Android" size="sm" onPress={() => window.location.replace(urls.testLinks.android)}/>
      </View> */}
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
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
