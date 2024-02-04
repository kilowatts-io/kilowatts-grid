import React from "react";
import { cleanup, renderHook, waitFor } from "@testing-library/react-native";
import { useEmbeddedForecasts } from "./embeddedForecasts";
import { Provider } from "react-redux";
import { createStore } from "../reducer";

const wrapper = (props: any) => {
  return <Provider store={createStore()} children={props.children} />;
};

describe("useEmbeddedForecasts/useEmbeddedForecasts", () => {
  test("can get live data response", async () => {
    const now = new Date("2024-01-25T12:15:00Z");
    const r = renderHook(() => useEmbeddedForecasts(now), { wrapper });
    await waitFor(() => {
      expect(r.result.current.data).toBeDefined();
    });
    console.log(r.result.current.data);
    r.unmount();
  }, 5000);

  afterEach(async () => {
    await cleanup();
  });
});
