import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";

import { useGbSummaryOutputQuery } from "../../../../../state/apis/cloudfront/api";
import { londonTimeHHMMSS } from "../../../../../utils/dateTime";
import VersionInfo from "../../../version-info";
import { GbLiveListItemBalancingTotal } from "../../live-list-item/live-list-item";

export const GbBalancingTotals = () => {
  const { data } = useGbSummaryOutputQuery(undefined, {
    pollingInterval: 1000 * 15
  });

  return (
    <>
      {data && (
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
      )}
      <VersionInfo />
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    paddingTop: 50
  },
  totals: {
    paddingTop: 15
  }
});
