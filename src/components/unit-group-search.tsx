/// a card search element that appears at the top of a list

import React from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { RootState, useAppDispatch, useAppSelector } from "../state";
import { actions } from "../state/search";

const selector = (state: RootState) => state.search.unitGroup;

const UnitGroupSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector(selector);
  const update = (x?: string) => dispatch(actions.setUnitGroup(x));
  const clear = () => dispatch(actions.setUnitGroup());
  React.useEffect(() => {
    clear()
    return () => {
      clear();
    };
  }, []);

  return (
    <View style={styles.wrapped}>
      <Searchbar
        style={styles.search}
        value={value || ""}
        onChangeText={update}
        onClearIconPress={clear}
        onSubmitEditing={(e) => update(e.nativeEvent.text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    wrapped: {
        padding: 5
    },
    search: {
    },
})

export default UnitGroupSearch;
