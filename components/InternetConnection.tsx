import { ExpoRoot } from "expo-router";
import React from "react";
import { NoInternetConnectionCard } from "../atoms/cards";
import { Refresh } from "../atoms/controls";
import { WithLicense } from "./WithLicense";
import { useInternetConnection } from "../services/hooks";

type InternetConnectionProps = {};

export const InternetConnection: React.FC<InternetConnectionProps> = () => {
  const { isConnected } = useInternetConnection();

  const ctx = require.context("../app");

  return (
    <>
      {isConnected === null && <Refresh refreshing={true} />}
      {isConnected === false && <NoInternetConnectionCard />}
      {isConnected === true && (
        <WithLicense>
          <ExpoRoot context={ctx} />
        </WithLicense>
      )}
    </>
  );
};
