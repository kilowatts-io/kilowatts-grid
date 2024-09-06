import React from "react";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Text } from "@rneui/themed";

import { acceptLicense, getTermsAccepted } from "../../../state/terms";

import { urls } from "./urls";
import { getCurrentYear } from "./utils";

const TermsAndConditionsAcceptanceModal: React.FC = () => {
  const dispatch = useDispatch();
  const acceptTerms = () => dispatch(acceptLicense());
  return (
    <Dialog testID="consent-dialog" isVisible={true}>
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
          onPress={acceptTerms}
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
  const accepted = useSelector(getTermsAccepted) || __DEV__;
  if (!accepted) {
    return <TermsAndConditionsAcceptanceModal />;
  }
  return props.children;
};

export default TermsAndConditionsAcceptanceModal;
