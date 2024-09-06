import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import VersionInfo from "../../../version-info";
import { GbLiveListItemBalancingTotal } from "../../live-list-item/live-list-item";
import { useNowQuery } from "@/src/state/api";
import { londonTimeHHMMSS } from "@/src/utils/dateTime";

export const GbBalancingTotals = () => {
  const { data } = useNowQuery(undefined, {
    pollingInterval: 1000 * 60,
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
    paddingTop: 50,
  },
  totals: {
    paddingTop: 15,
  },
});
