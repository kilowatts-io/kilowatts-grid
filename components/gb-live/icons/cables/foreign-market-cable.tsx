import React from "react";
import * as flags from "./flags";
import { ForeignMarketName } from "../../../../state/gb/fixtures/interconnectors/interconnectors";
import { CanvasPoint } from "../../svg-map/types";

type ForeignFlagProps = {
  name: ForeignMarketName;
  point: CanvasPoint;
};

export const ForeignFlag: React.FC<ForeignFlagProps> = (p) => {
  switch (p.name) {
    case "france":
      return <flags.France {...p} />;
    case "belgium":
      return <flags.Belgium {...p} />;
    case "netherlands":
      return <flags.Netherlands {...p} />;
    case "denmark":
      return <flags.Denmark {...p} />;
    case "norway":
      return <flags.Norway {...p} />;
    case "ireland":
      return <flags.Ireland {...p} />;
    default:
      console.error(`unknown foreign market cable key: ${p.name}`);
      return <></>;
  }
};
