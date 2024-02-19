import React, { useCallback, useRef } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useDispatch } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetModalProvider
} from "@gorhom/bottom-sheet";

import { useGbSummaryOutputQuery } from "../../state/apis/cloudfront/api";
import { setSelectedUnitGroupCode } from "../../state/gb/live";

import { GbLiveBottomSheetTabs } from "./bottom-sheet-tabs/tabs";
import SvgMap from "./svg-map/svg-map";
import { WithTermsAndConditionsAccepted } from "./terms-and-conditions/acceptance";

const SNAP_POINTS = ["10%", "20%", "30%", "40%", "50%", "75%", "90%"];
const INITIAL_SNAP_POINT_INDEX = 2;

export const GbLiveWrapped: React.FC = () => {
  const screen = useWindowDimensions();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [currentSnapPointIndex, setCurrentSnapPointIndex] = React.useState(
    INITIAL_SNAP_POINT_INDEX
  );
  const usableHeight = React.useMemo(
    () => screen.height * (1 - currentSnapPointIndex / SNAP_POINTS.length),
    [currentSnapPointIndex, screen.height]
  );

  React.useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentSnapPointIndex(index);
    if (index <= INITIAL_SNAP_POINT_INDEX)
      dispatch(setSelectedUnitGroupCode(null));
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
          <GbLiveBottomSheetTabs usableHeight={usableHeight} />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export const GbLive = () => {
  const query = useGbSummaryOutputQuery();
  React.useEffect(() => {
    query.refetch();
  }, []);

  return (
    <WithTermsAndConditionsAccepted>
      <GbLiveWrapped />
    </WithTermsAndConditionsAccepted>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1
  }
});
