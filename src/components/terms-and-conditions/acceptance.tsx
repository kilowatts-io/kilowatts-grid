import React from "react";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Text } from "@rneui/themed";
import { acceptLicense, getTermsAccepted } from "@/src/state/terms";
import { urls } from "./urls";

export const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
};

const TermsAndConditionsAcceptanceModal: React.FC<{
  visible: boolean;
}> = ({ visible }) => {
  const dispatch = useDispatch();
  return (
    <Dialog testID="consent-dialog" isVisible={visible}>
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
          onPress={() => dispatch(acceptLicense())}
          testID="consent-dialog-accept-button"
        />
        <Dialog.Button
          title="View Elexon License"
          onPress={() => Linking.openURL(urls.elexonLicense)}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export const WithTermsAndConditionsAccepted = (props: {
  children: JSX.Element;
}) => {
  const accepted = useSelector(getTermsAccepted)
  return (
    <>
      <TermsAndConditionsAcceptanceModal visible={!accepted} />
      {props.children}
    </>
  );
};

export default TermsAndConditionsAcceptanceModal;
