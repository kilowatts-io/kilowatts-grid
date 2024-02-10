import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { selectors } from "../../../../../state/gb/live";
import { GbLiveListItemBalancingTotal } from "../../live-list-item/live-list-item";

export const GbBalancingTotals = () => {
  const initialLoadComplete = useSelector(selectors.initialLoadComplete);
  const bid = useSelector(selectors.balancingTotalsBid);
  const offer = useSelector(selectors.balancingTotalsOffer);
  return (
    <View style={styles.totals}>
      {initialLoadComplete && (
        <>
          <GbLiveListItemBalancingTotal
            name="Total Bid Acceptances"
            balancingVolume={bid}
          />
          <GbLiveListItemBalancingTotal
            name="Total Offer Acceptances"
            balancingVolume={offer}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  totals: {
    paddingTop: 15
  }
});
