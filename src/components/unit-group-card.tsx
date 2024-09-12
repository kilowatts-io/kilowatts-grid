import React from "react";
import { Card, List } from "react-native-paper";
import { formatMW } from "./icon-list-item";
import { ScrollView } from "react-native";

interface UnitGroupAccordionProps {
  title: string;
  content: string | number;
}

const UnitGroupAccordion: React.FC<UnitGroupAccordionProps> = ({
  title,
  content,
}) => {
  return <List.Item title={title} description={content.toString()} />;
};

/**
 * Render the percentage as a string
 */
const renderCapacityFactor = (capacityFactor: number) =>
  `${(capacityFactor * 100).toFixed(2)}%`;

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const UnitGroupCard: React.FC<AppListIconProps> = (p) => {
  return (
    <ScrollView>

        <UnitGroupAccordion title="Type" content={capitalise(p.fuel_type)} />
        <UnitGroupAccordion
          title="Actual Output"
          content={formatMW(p.output.level)}
        />
        <UnitGroupAccordion title="Capacity" content={formatMW(p.capacity)} />
        <UnitGroupAccordion
          title="Capacity Factor"
          content={renderCapacityFactor(p.capacityFactor)}
        />
        <UnitGroupAccordion
          title="Ramp Rate / minute"
          content={formatMW(p.output.delta)}
        />
        <UnitGroupAccordion
          title="Scheduled (PN - pre balancing) Output"
          content={formatMW(p.output.level - p.balancing_volume)}
        />
        <UnitGroupAccordion
          title="Balancing Market Volume"
          content={formatMW(p.balancing_volume)}
        />
    </ScrollView>
  );
};

export default UnitGroupCard;
