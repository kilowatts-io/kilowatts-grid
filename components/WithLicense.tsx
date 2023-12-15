import React from "react";
import { useAppDispatch, useAppSelector } from "../services/state";
import { acceptLicense, getLicenseAccepted } from "../services/state/terms";
import { ConsentDialog } from "../atoms/dialogs";
import log from "../services/log";

type WithLicenseProps = {
  children: React.ReactNode;
};
export const WithLicense: React.FC<WithLicenseProps> = ({ children }) => {
    log.debug("WithLicense");
  const dispatch = useAppDispatch();
  const termsAccepted = useAppSelector((state) => getLicenseAccepted(state));
  return (
    <>
      <ConsentDialog
        isVisible={!termsAccepted}
        onAccept={() => {
          dispatch(acceptLicense());
        }}
      />
      {children}
    </>
  );
};
