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

const VIEWABLE_ITEM_INDEX = 1

export const GbUnitGroupsList: React.FC = () => {
  const dispatch = useDispatch();
  const list = React.useRef<FlashList<{ code: string }>>(null);
  const data = useSelector(selectors.unitGroupSorted);
  const initialLoadComplete = useSelector(selectors.initialLoadComplete);
  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);

  const initialScrollIndex = React.useMemo(() => {
    if (!selectedUnitGroupCode) return undefined;
    const index = data.findIndex((g) => g.code === selectedUnitGroupCode);
    return index > 0 ? index : undefined;
  }, [selectedUnitGroupCode, data]);

  React.useEffect(() => {
    if (initialLoadComplete) {
      list.current?.scrollToIndex({
        index: initialScrollIndex ?? VIEWABLE_ITEM_INDEX,
        animated: true,
      });
    }
  }, [selectedUnitGroupCode])

  return (
    <FlashList
      ref={list as any}
      initialScrollIndex={initialScrollIndex}
      refreshing={!initialLoadComplete}
      data={data}
      keyExtractor={(x) => x.code}
      estimatedItemSize={30}
      renderItem={({ item }) => <UnitGroupListLiveItem code={item.code} />}
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
};

const UnitGroupListLiveItem: React.FC<{ code: string }> = ({ code }) => {
  const dispatch = useDispatch();

  const selected = useSelector((state: RootState) =>
    selectors.isSelectedUnitGroupCode(state, code)
  );
  const capacity = useSelector((state: RootState) =>
    selectors.unitGroupCapacity(state, code)
  );
  const currentOutput = useSelector((state: RootState) =>
    selectors.unitGroupCurrentOutput(state, code)
  );
  const balancingVolume = useSelector((state: RootState) =>
    selectors.unitGroupBalancingVolume(state, code)
  );
  const nameFuelType = unitGroupNameFuelTypes[code];
  const balancingDirection = calculateBalancingDirection(balancingVolume);
  const capacityFactor = calculateCapacityFactor(currentOutput.level, capacity);
  return (
    <GbLiveListItem
      key={code}
      name={nameFuelType.name}
      type={nameFuelType.fuelType}
      capacity={capacity}
      output={currentOutput.level}
      delta={currentOutput.delta}
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