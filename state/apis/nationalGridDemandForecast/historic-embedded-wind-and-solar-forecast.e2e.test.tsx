import { renderHook, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "../../reducer";
import { useHistoricEmbeddedWindAndSolarForecastQuery } from "./api";
import React from "react";

const wrapper = (props: any) => {
  return <Provider store={createStore()} children={props.children} />;
};

describe("state/apis/nationalGridDemandForecast/historic-embedded-wind-and-solar-forecast", () => {
  test("can query for 2024-01-01", async () => {
    const year = 2024;
    const month = 1;
    const day = 1;
    const hour = 12;

    const hook = renderHook(
      () =>
        useHistoricEmbeddedWindAndSolarForecastQuery({
          year,
          month,
          day,
          hour,
        }),
      { wrapper }
    );

    await waitFor(() => {
      expect(hook.result.current.data).toBeDefined();
      expect(hook.result.current.data).toMatchSnapshot();
    });
  });

  test("can query for 2024-01-24", async () => {
    const year = 2024;
    const month = 1;
    const day = 24;
    const hour = 12;

    const hook = renderHook(
      () =>
        useHistoricEmbeddedWindAndSolarForecastQuery({
          year,
          month,
          day,
          hour,
        }),
      { wrapper }
    );

    await waitFor(() => {
      expect(hook.result.current.data).toBeDefined();
      expect(hook.result.current.data).toMatchSnapshot();
    });
  });
});
