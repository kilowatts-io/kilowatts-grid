import React from "react";
import { FlashList } from "@shopify/flash-list";
import { selectors, setSelectedUnitGroupCode } from "../../../../state/gb/live";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../state/reducer";
import { unitGroupNameFuelTypes } from "../../../../state/gb/fixtures/generators/unit-groups";
import { GbLiveListItem } from "../live-list-item/live-list-item";
import { View, StyleSheet } from "react-native";
import {
  calculateBalancingDirection,
  calculateCapacityFactor,
} from "../../icons/tools";


export const GbUnitGroupsList: React.FC = () => {
  const initialLoadComplete = useSelector(selectors.initialLoadComplete);
  const list = React.useRef<FlashList<{ code: string }>>(null);
  const data = useSelector(selectors.unitGroupSorted);
  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);
  React.useEffect(() => {
    if (!selectedUnitGroupCode) return undefined;
    const index = data.findIndex((g) => g.code === selectedUnitGroupCode);
    if (index <= 1) return undefined;
    list.current?.scrollToIndex({
      index: index,
      viewPosition: 0,
      animated: true,
    });
  }, [selectedUnitGroupCode]);
  return (
    <FlashList
      ref={list as any}
      data={initialLoadComplete && data}
      keyExtractor={(x) => x.code}
      estimatedItemSize={30}
      renderItem={({ item }) => <UnitGroupListLiveItem code={item.code} />}
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
};

const UnitGroupListLiveItem: React.FC<{ code: string }> = ({ code }) => {
  const dispatch = useDispatch();
  // selectors
  const selected = useSelector((state: RootState) => selectors.isSelectedUnitGroupCode(state, code))
  const capacity = useSelector((state: RootState) => selectors.unitGroupCapacity(state, code));
  const currentOutput = useSelector((state: RootState) => selectors.unitGroupCurrentOutput(state, code));
  const balancingVolume = useSelector((state: RootState) => selectors.unitGroupBalancingVolume(state, code));
  // memos to reduce re-renders
  const nameFuelType = React.useMemo(() => unitGroupNameFuelTypes[code], [code]);
  const balancingDirection = React.useMemo(() => calculateBalancingDirection(balancingVolume), [balancingVolume]);
  const capacityFactor = React.useMemo(() => calculateCapacityFactor(currentOutput.level, capacity), [currentOutput.level, capacity]);
  const roundedCapacity = React.useMemo(() => Math.round(capacity), [capacity]);
  const roundedCurrentOutput1Dp = React.useMemo(() => Math.round(currentOutput.level * 10) / 10, [currentOutput.level]);
  const roundedRoundedCurrentOutputDelta1Dp = React.useMemo(() => Math.round(currentOutput.delta * 10) / 10, [currentOutput.delta]);

  return (
    <GbLiveListItem
      key={code}
      name={nameFuelType.name}
      type={nameFuelType.fuelType}
      capacity={roundedCapacity}
      output={roundedCurrentOutput1Dp}
      delta={roundedRoundedCurrentOutputDelta1Dp}
      balancingVolume={balancingVolume}
      balancingDirection={balancingDirection}
      capacityFactor={capacityFactor}
      selected={selected}
      onPress={() => dispatch(setSelectedUnitGroupCode(code))}
    />
  );
};

const styles = StyleSheet.create({
  footer: { height: 100 },
});
