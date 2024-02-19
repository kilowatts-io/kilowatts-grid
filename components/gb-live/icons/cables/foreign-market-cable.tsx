import React from "react";

import { GbSummaryForeignMarketKey } from "../../../../state/apis/cloudfront/types";
import { CanvasPoint } from "../../svg-map/types";

import * as flags from "./flags";

type ForeignFlagProps = {
  code: GbSummaryForeignMarketKey;
  point: CanvasPoint;
};

export const ForeignFlag: React.FC<ForeignFlagProps> = (p) => {
  switch (p.code) {
    case "fr":
      return <flags.France {...p} />;
    case "be":
      return <flags.Belgium {...p} />;
    case "nl":
      return <flags.Netherlands {...p} />;
    case "dk":
      return <flags.Denmark {...p} />;
    case "no":
      return <flags.Norway {...p} />;
    case "ie":
      return <flags.Ireland {...p} />;
    default:
      console.error(`unknown foreign market cable key: ${p.code}`);
      return <></>;
  }
};
