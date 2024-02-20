import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";

import { useGbSummaryOutputQuery } from "../../../../../state/apis/cloudfront/api";
import { londonTimeHHMMSS } from "../../../../../utils/dateTime";
import { GbLiveListItemBalancingTotal } from "../../live-list-item/live-list-item";

export const GbBalancingTotals = () => {
  const { data } = useGbSummaryOutputQuery(undefined, {
    pollingInterval: 1000 * 15
  });

  if (!data) return null;

  return (
    <>
      <View style={styles.totals}>
        <>
          <GbLiveListItemBalancingTotal
            name="Total Bid Acceptances"
            balancingVolume={data && -data.balancing_totals.bids}
          />
          <GbLiveListItemBalancingTotal
            name="Total Offer Acceptances"
            balancingVolume={data && data.balancing_totals.offers}
          />
        </>
      </View>
      <View style={styles.center}>
        <Text>
          {data && `Valid for ${londonTimeHHMMSS(new Date(data.dt))}`}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    paddingTop: 15
  },
  totals: {
    paddingTop: 15
  }
});
