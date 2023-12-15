import React from "react";
import { Dialog, Text } from "@rneui/themed";
import log from "../services/log";
import { Linking } from "react-native";

type ConsentDialogProps = {
  isVisible: boolean;
  onAccept: () => void;
};

export const ConsentDialog: React.FC<ConsentDialogProps> = ({
  onAccept,
  isVisible,
}) => {
  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={() => log.debug("onBackdropPress")}
    >
      <Dialog.Title title="kilowatts.io" />
      <Text>
        This app is provided without any warranty. Use at your own risk.
      </Text>
      <Text>
        Contains BMRS data © Elexon Limited copyright and database right{" "}
        {new Date().getFullYear()}.
      </Text>
      <Dialog.Actions>
       
        <Dialog.Button title="I agree" onPress={onAccept} />
        <Dialog.Button
          title="View Elexon License"
          onPress={() => {
            Linking.openURL(
              "https://www.elexon.co.uk/data/balancing-mechanism-reporting-agent/copyright-licence-bmrs-data/"
            );
          }}
        />
      </Dialog.Actions>
    </Dialog>
  );
};
