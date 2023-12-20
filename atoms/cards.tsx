import React from "react";
import { Button, Card, Text } from "@rneui/themed";
import { Linking, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import log from "../services/log";
import { urls } from "../services/nav";
import { londonTime } from "../common/utils";

/*
IncompleteUnknownCategories
Render a card with a message asking for help to categorise the unknown balancing mechanism units.
*/
export const IncompleteUnknownCategories = () => {
  return (
    <Card>
      <Card.Title>
        <Text>Help us!</Text>
      </Card.Title>
      <Card.Divider />
      <Text>
        This open-source app is incomplete. We need help to categorise the
        hundreds of individual balancing mechnism units into the right
        categories, giving them human readable names and plotting them on the
        map.
      </Text>

      <View style={styles.spacer} />

      <Text>
        All the Unknown values represents balancing mechanism units we haven't
        yet categorised. We need open-source contributions to complete this
        work.
      </Text>

      <View style={styles.spacer} />

      <Text>Please help us by contributing to the project on GitHub.</Text>

      <View style={styles.spacer} />

      <Button
        testID="github-repo-link"
        onPress={() => Linking.openURL(urls.githubRepo)}
        icon={<FontAwesome name="github" size={24} color="white" />}
      />
    </Card>
  );
};

/*
UnknownUnitGroupCode
Render a card with a message saying we can't find the unit group.
*/
export const UnknownUnitGroupCode = () => {
  log.debug(`UnknownUnitGroupCode`);
  return (
    <Card>
      <Card.Title>
        <Text>Error</Text>
      </Card.Title>
      <Card.Divider />
      <Text>
        Cannot find details for this generator. Please check the URL and try
        again.
      </Text>
    </Card>
  );
};

/*
MissingScreen
Render a card with a message saying the screen doesn't exist.
*/
export const MissingScreen: React.FC = () => {
  log.debug(`MissingScreen`);
  return (
    <Card>
      <Card.Title>
        <Text>Error</Text>
      </Card.Title>
      <Card.Divider />
      <Text>This screen does not exist.</Text>
      <Card.Divider />
      <Button
        testID="reset-home-button"
        onPress={() => {
          Linking.openURL(urls.home);
        }}
      >
        Reset to Home screen
      </Button>
    </Card>
  );
};

type UnitListHeaderProps = {
  now?: Date;
};

/*
UnitListHeader
Render a card with either a loading message or the london time of the latest update
*/
export const UnitListHeader: React.FC<UnitListHeaderProps> = ({ now }) => {
  const props = { testID: "unit-list-header-text" };
  return (
    <Card containerStyle={styles.listHeaderCard}>
      {now ? (
        <Text {...props} testID="unit-list-header-text">
          Live individual unit output at {londonTime(now)}
        </Text>
      ) : (
        <Text {...props}>Loading data for individual units</Text>
      )}
    </Card>
  );
};

type UnitGroupHistoryListHeaderComponentProps = {
  bmUnit: string;

};

/*
UnitGroupScheduleHeader
Render a card with the unit group name and the words "Upcoming Schedule"
*/
export const UnitGroupScheduleHeader: React.FC<
  UnitGroupHistoryListHeaderComponentProps
> = ({ bmUnit }) => {
  return (
    <Card containerStyle={styles.listHeaderCard}>
      <Card.Title>{bmUnit}</Card.Title>
      <Card.Divider />
      <Text>Upcoming Schedule</Text>
    </Card>
  );
};

/*
EmptyScheduleCard

*/
export const EmptyScheduleCard: React.FC = () => {
  return (
    <Card containerStyle={styles.listHeaderCard}>
      <Card.Title>No Scheduled Output</Card.Title>
      <Card.Divider />
      <Text>None of the units are expected to generate/consume of the coming hours</Text>
      <View style={styles.spacer} />
      <Text>They may be under maintenance.</Text>
    </Card>
  );
};

/*
ApiError
*/
type ApiErrorProps = {
  refetch: () => void;
}
export const ApiErrorCard: React.FC<ApiErrorProps> = ({ refetch }) => {
  return (
    <Card>
      <Card.Title>
        <Text>API Error</Text>
      </Card.Title>
      <View style={styles.spacer} />

      <Text>
        There was an error fetching/interpreting data from the Elexon API. Please try again later.
      </Text>

      <View style={styles.spacer} />


      <Button onPress={refetch}>Try again</Button>
    </Card>
  )
}

const styles = StyleSheet.create({
  spacer: { height: 10 },
  listHeaderCard: {
    margin: 0,
    // padding: 0,
  },
});
