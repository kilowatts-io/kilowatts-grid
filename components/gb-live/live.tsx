import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { selectors, setSelectedUnitGroupCode } from "../../state/gb/live";
import { useDispatch, useSelector } from "react-redux";
import { GbLiveBottomSheetTabs } from "./bottom-sheet-tabs/tabs";
import { WithTermsAndConditionsAccepted } from "./terms-and-conditions/acceptance";
import SvgMap from "./svg-map/svg-map";
import { useGbLive } from "../../state/gb/hooks";

const SNAP_POINTS = ["10%", "20%", "30%", "40%", "50%", "75%", "90%"];
const INITIAL_SNAP_POINT_INDEX = 2

export const GbLiveWrapped = () => {
  const dispatch = useDispatch();
  const isLoaded = useSelector(selectors.initialLoadComplete);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    if (isLoaded) bottomSheetModalRef.current?.present();
  }, [isLoaded]);

  const handleSheetChanges = useCallback((index: number) => {
    if(index<=INITIAL_SNAP_POINT_INDEX) dispatch(setSelectedUnitGroupCode(null))
  }, []);

  return (
    <View style={styles.mapContainer}>
      <BottomSheetModalProvider>
        <SvgMap />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={INITIAL_SNAP_POINT_INDEX}
          snapPoints={SNAP_POINTS}
          onChange={handleSheetChanges}
          enablePanDownToClose={false}
        >
          <GbLiveBottomSheetTabs />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export const GbLive = () => {
  useGbLive();
  return (
    <WithTermsAndConditionsAccepted>
      <GbLiveWrapped />
    </WithTermsAndConditionsAccepted>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  tabTitleStyle: {
    fontSize: 10,
  },
  contentContainer: {},
});
