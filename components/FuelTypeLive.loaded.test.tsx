import React from "react";
import { render} from "@testing-library/react-native";
import { FuelTypeLive as Comp } from "./FuelTypeLive";
import { NavigationContainer } from "@react-navigation/native";
import { FuelTypeLevel } from "../common/types";

// local mocks
const mockListItem = jest.fn();
const mockIncompleteUnknownCategories = jest.fn();
const mockDate = new Date(Date.parse("2023-01-01T00:45:13Z"));
const mockRefetch = jest.fn();

const mockSetNavOptions = jest.fn();
const mockNav = {
  setOptions: (x: any) => mockSetNavOptions(x),
};

// mock ../services/state/elexon-insights-api.hooks
jest.mock("../services/state/elexon-insights-api.hooks", () => ({
  useFuelTypeLiveQuery: () => ({
    data: [
      {
        name: "coal",
        level: 1,
      },
    ] as FuelTypeLevel[],
    isLoading: false,
    now: mockDate,
    refetch: mockRefetch,
  }),
}));

// mock IncompleteUnknownCategories from ../atoms/cards
jest.mock("../atoms/cards", () => ({
  IncompleteUnknownCategories: () => mockIncompleteUnknownCategories(),
}));

// mock ../atoms/list-items
jest.mock("../atoms/list-items", () => ({
  FuelTypeLive: (x: any) => mockListItem(x),
}));

//mock expo-router
jest.mock("expo-router", () => ({
  useNavigation: () => mockNav,
}));

describe("components/FuelTypeLive", () => {
  beforeEach(() => {
    mockListItem.mockClear();
    mockIncompleteUnknownCategories.mockClear();
    render(
      <NavigationContainer>
        <Comp />
      </NavigationContainer>
    );
  });

  test("expect mockListItem to be called with name coal and level 1 ", () => {
    expect(mockListItem).toHaveBeenCalledWith({ name: "coal", level: 1 });
  });

  test("expect mockIncompleteUnknownCategories to be called and therefore rendered", () => {
    expect(mockIncompleteUnknownCategories).toHaveBeenCalled();
  });

  test('expect mockSetNavOptions to be called with title "National Grid at: 00:00:00"', () => {
    expect(mockSetNavOptions).toHaveBeenCalledWith({
      title: "National Grid at: 00:45:13",
    });
  })

});
