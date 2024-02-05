import { useSharedValue } from "react-native-reanimated";
import { foreignMarkets } from "../../../../../state/gb/fixtures/interconnectors/interconnectors";
import calculatePoint from "../../../svg-map/calcs/point";
import { Cable } from "../cable";
import { ForeignFlag } from "../foreign-market-cable";
import React from "react";
import { MapContext } from "../../../svg-map/context";
import { store } from "../../../../../state/reducer";
import { selectors as s } from "../../../../../state/gb/live";
import {
  calculateCycleSecondsInterconnector,
  calculateSizePx,
} from "../../calcs";
import { CanvasPoint } from "../../../svg-map/types";
import { Group } from "@shopify/react-native-skia";
import { ErrorBoundaryBlank } from "../../../error-boundary";

type GbCableProps = {
  unitGroupCode: string;
  capacity: number;
  from: CanvasPoint;
  to: CanvasPoint;
};

const GbCable: React.FC<GbCableProps> = (p) => {
  const { gestureMode } = React.useContext(MapContext);
  const cycleSeconds = useSharedValue<null | number>(null);
  const width = React.useMemo(() => calculateSizePx(p.capacity), [p.capacity]);

  React.useEffect(() => {
    const setCycleSeconds = () => {
      if (gestureMode.value !== "none") cycleSeconds.value = null;
      const output = s.unitGroupCurrentOutput(
        store.getState(),
        p.unitGroupCode
      );
      const cs = calculateCycleSecondsInterconnector(p.capacity, output);
      if (cycleSeconds.value !== cs) cycleSeconds.value = cs;
    };
    setCycleSeconds();
    const sub = store.subscribe(() => setCycleSeconds());
    return () => sub();
  }, [p.unitGroupCode, gestureMode.value]);

  return <Cable {...p} cycleSeconds={cycleSeconds} width={width} />;
};

const GbForeignMarkets = foreignMarkets.map((m, key) => {
  const foreignPoint = calculatePoint(m.coords);
  return (
    <Group key={`group-int-${m.name}`}>
      <ForeignFlag key={key} name={m.name} point={foreignPoint} />
      {m.interconnectors.map((i, key) => (
        <ErrorBoundaryBlank key={`error-b-int-${i.code4}`}>
          <GbCable
            key={key}
            capacity={i.capacity}
            unitGroupCode={i.code4}
            from={calculatePoint(i.coords)}
            to={foreignPoint}
          />
        </ErrorBoundaryBlank>
      ))}
    </Group>
  );
});

export default GbForeignMarkets;
