import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { selectors, setSelectedUnitGroupCode } from "../../state/gb/live";
import { useDispatch, useSelector } from "react-redux";
import { useGbLive } from "../../state/gb/hooks";
import { GbLiveBottomSheetTabs } from "./bottom-sheet-tabs/tabs";
import { WithTermsAndConditionsAccepted } from "./terms-and-conditions/acceptance";
import SvgMap from "./svg-map/svg-map";
import { Button, Icon } from "@rneui/themed";
import { MAP_BACKGROUND_COLOR, MAP_BOTTOM_BUTTON_HEIGHT } from "./constants";
// import { SafeAreaView } from "react-native-safe-area-context";

const SNAP_POINTS = ["20%", "30%", "40%", "50%", "75%", "90%"];
const INITIAL_SNAP_POINT_INDEX = 3;

export const GbLiveWrapped = () => {
  useGbLive();
  const dispatch = useDispatch();
  const isLoaded = useSelector(selectors.initialLoadComplete);
  const selectedGeneratorId = useSelector(selectors.selectedUnitGroupCode);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  React.useEffect(() => {
    // on initial load - pop up the bottom menu once data has loaded to an acceptable state
    if (isLoaded) bottomSheetModalRef.current?.present();
  }, [isLoaded]);
  React.useEffect(() => {
    if (selectedGeneratorId !== null) bottomSheetModalRef.current?.present();
  }, [selectedGeneratorId]);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if(index===0)dispatch(setSelectedUnitGroupCode(null))
  }, []);

  return (
    <View style={styles.mapContainer}>
      <BottomSheetModalProvider>
        <SvgMap />
        <View style={styles.bottomButton}>
          <Button
            onPress={handlePresentModalPress}
            type="clear"
            icon={
              <Icon
                name={"chevron-up-circle-sharp"}
                type={"ionicon"}
                color="white"
                size={40}
              />
            }
          />
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={INITIAL_SNAP_POINT_INDEX}
          snapPoints={SNAP_POINTS}
          onChange={handleSheetChanges}
        >
          <GbLiveBottomSheetTabs />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export const GbLive = () => (
  <WithTermsAndConditionsAccepted>
    <GbLiveWrapped />
  </WithTermsAndConditionsAccepted>
);

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  bottomButton: {
    height: MAP_BOTTOM_BUTTON_HEIGHT,
    backgroundColor: MAP_BACKGROUND_COLOR,
  },
  tabTitleStyle: {
    fontSize: 10,
  },
  contentContainer: {},
});
