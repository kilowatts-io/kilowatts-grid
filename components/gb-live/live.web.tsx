import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "@rneui/themed";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

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
  const refetch = useGbLive();
  return (
    <WithTermsAndConditionsAccepted>
      <>
        <WithSkiaWeb
          // getComponent={() => import("./svg-map/skia-test")}
          getComponent={async () => {
            const SvgMap = (await import("./svg-map/svg-map")).default;
            return { default: () => <SvgMap refetch={refetch} /> };
          }}
          fallback={<span>Loading Map...</span>}
        />
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
