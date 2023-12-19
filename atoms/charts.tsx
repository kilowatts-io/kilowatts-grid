import React from "react";
import { VictoryStack, VictoryArea, VictoryLegend } from "victory-native";

type UnitGroupUnitsStackedChartProps = {};
export const UnitGroupUnitsStackedChart: React.FC<
  UnitGroupUnitsStackedChartProps
> = () => {
  return (
    <VictoryStack

    >
      <VictoryArea
        style={{
          data: { fill: "tomato", stroke: "tomato" },
        }}
        data={[
          { x: "One", y: 2 },
          { x: "Two", y: 3 },
          { x: "Three", y: 5 },
        ]}
      />

      <VictoryLegend
        x={125}
        title="Units"
        centerTitle
        orientation="horizontal"
        gutter={20}
        style={{ border: { stroke: "black" }, title: { fontSize: 20 } }}
        data={[
          { name: "One", symbol: { fill: "tomato", type: "star" } },
          { name: "Two", symbol: { fill: "orange", type: "star" } },
          { name: "Three", symbol: { fill: "gold", type: "star" } },
        ]}
      />
    </VictoryStack>
  );
};
