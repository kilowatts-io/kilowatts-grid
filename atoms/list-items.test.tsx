import React from "react";
import { render, screen } from "@testing-library/react-native";
import * as l from "./list-items";

// mock out the FuelTypeIcon component
jest.mock("./icons", () => ({
  FuelTypeIcon: (x: any) => `FuelTypeIcon:${x.fuelType}`,
}));

describe("atoms/list-items/GeneratorLive", () => {
  beforeEach(() => {
    render(
      <l.GeneratorLive
        index={0}
        fuelType="coal"
        name="my name"
        level={100}
        onPress={() => {}}
      />
    );
  });

  test("renders expected text", () => {
    screen.findByText("my name");
    screen.findByText("100 MW");
  });

  test("renders mocked FuelTypeIcon", () => {
    screen.findByText("FuelTypeIcon:coal");
  });

  test("renders generator-live-0 testId used in e2e tests", () => {
    screen.findByTestId("generator-live-0");
  });
});
