import React from "react";

import { GbSummaryOutputForeignMarket } from "../../../state/apis/cloudfront/types";
import { calculateCycleSeconds } from "../../../state/utils";
import { Cable } from "../icons/cables/cable";
import { ForeignFlag } from "../icons/cables/foreign-market-cable";
import { calculateSizePx } from "../icons/calcs";

import calculatePoint from "./calcs/point";

export const ForeignMarket: React.FC<GbSummaryOutputForeignMarket> = (f) => {
  const foreignPoint = calculatePoint(f.coords);
  return (
    <>
      <ForeignFlag
        point={foreignPoint}
        key={`foreign-flag-${f.code}`}
        code={f.code}
      />
      <>
        {f.interconnectors.map((i) => {
          const cycleSeconds = calculateCycleSeconds(i);
          const width = calculateSizePx(i.cp);
          const from = calculatePoint(i.coords);
          return (
            <Cable
              from={from}
              to={foreignPoint}
              cycleSeconds={cycleSeconds}
              width={width}
              isExport={i.ac < 0}
              key={`cable-${i.code}`}
            />
          );
        })}
      </>
    </>
  );
};
