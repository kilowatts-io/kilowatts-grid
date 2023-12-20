import React from "react";
import { Dialog, Text } from "@rneui/themed";
import { Linking } from "react-native";
import { urls } from "../services/nav";
import { getCurrentYear } from "../common/utils";

type ConsentDialogProps = {
  isVisible: boolean;
  onAccept: () => void;
  onBackdropPress?: () => void;
};

export const ConsentDialog: React.FC<ConsentDialogProps> = ({
  onAccept,
  isVisible,
  onBackdropPress,
}) => {
  return (
    <Dialog
      testID="consent-dialog"
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
    >
      <Dialog.Title title="kilowatts.io" />
      <Text>
        This app is provided without any warranty. Use at your own risk.
      </Text>
      <Text>
        Contains BMRS data © Elexon Limited copyright and database right{" "}
        {getCurrentYear()}.
      </Text>
      <Dialog.Actions>
        <Dialog.Button
          title="I agree"
          onPress={onAccept}
          testID="consent-dialog-accept-button"
        />
        <Dialog.Button
          title="View Elexon License"
          onPress={() => Linking.openURL(urls.elexonLicense)}
        />
        <Dialog.Button
          title="View App Privacy Policy"
          onPress={() => {
            Linking.openURL(urls.privacy);
          }}
        />
      </Dialog.Actions>
    </Dialog>
  );
};
