import React from "react";
import { render, screen } from "@testing-library/react-native";
import { FuelTypeLive as Comp } from "./FuelTypeLive";
import { NavigationContainer } from "@react-navigation/native";
import { FuelTypeLevel } from "../common/types";

// local mocks
const mockListItem = jest.fn();
const mockIncompleteUnknownCategories = jest.fn();
const mockRefetch = jest.fn();
const mockRefresh = jest.fn();

const mockSetNavOptions = jest.fn();
const mockNav = {
  setOptions: (x: any) => mockSetNavOptions(x),
};

// mock ../services/state/elexon-insights-api.hooks
jest.mock("../services/state/elexon-insights-api.hooks", () => ({
  useFuelTypeLiveQuery: () => ({
    data: null,
    isLoading: true,
    now: null,
    refetch: mockRefetch
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

// mock atoms/controls/refresh
jest.mock("../atoms/controls", () => ({
  Refresh: (props: any) => mockRefresh(props)
}));

describe("components/FuelTypeLive", () => {
  beforeEach(() => {
    mockRefresh.mockClear();
    mockListItem.mockClear();
    mockIncompleteUnknownCategories.mockClear();
    render(
      <NavigationContainer>
        <Comp />
      </NavigationContainer>
    );
  });
  test('expect refresh control to have been called with props refreshing true and a function on onRefresh', () => {
    expect(mockRefresh).toHaveBeenCalledWith({
      refreshing: true,
      onRefresh: expect.any(Function),
    })
  })

  test("expect mockListItem to not be called  ", () => {
    expect(mockListItem).toHaveBeenCalledTimes(0);
  });

  test("expect mockIncompleteUnknownCategories to have been called and therefore rendered", () => {
    expect(mockIncompleteUnknownCategories).toHaveBeenCalledTimes(1);
  });

  test('expect mockSetNavOptions to be called with title "National Grid at: 00:00:00"', () => {
    expect(mockSetNavOptions).toHaveBeenCalledWith({
      title: "Loading...",
    });
  })


});
