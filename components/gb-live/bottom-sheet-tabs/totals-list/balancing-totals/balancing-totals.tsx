import { StyleSheet, View } from "react-native";

import { useGbSummaryOutputQuery } from "../../../../../state/apis/cloudfront/api";
import { GbLiveListItemBalancingTotal } from "../../live-list-item/live-list-item";

export const GbBalancingTotals = () => {
  const { data } = useGbSummaryOutputQuery();

  return (
    <View style={styles.totals}>
      <>
        <GbLiveListItemBalancingTotal
          name="Total Bid Acceptances"
          balancingVolume={data && data.balancing_totals.bids}
        />
        <GbLiveListItemBalancingTotal
          name="Total Offer Acceptances"
          balancingVolume={data && data.balancing_totals.offers}
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  totals: {
    paddingTop: 15
  }
});
