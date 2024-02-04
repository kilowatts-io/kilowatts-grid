import { createStore } from "../../reducer";
import { elexonApi } from "./api";
import { renderHook, cleanup, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import React from "react";

const { usePnQuery } = elexonApi;

const wrapper = (props: any) => {
  return <Provider store={createStore()} children={props.children} />;
};

describe("pn", () => {
  test("usePnQuery", async () => {
    const p = {
      settlementDate: "2023-12-01",
      period: 1,
    };
    const r = renderHook(
      () =>
        usePnQuery({
          settlementDate: p.settlementDate,
          settlementPeriod: p.period,
        }),
      { wrapper }
    );
    // wait for data
    await waitFor(() => {
      expect(r.result.current.data).toBeDefined();
      expect(r.result.current.data?.length).toBeGreaterThan(0);
      expect(r.result.current.data).toMatchSnapshot();
    });
    r.unmount();
    return null;
  });

  afterEach(async () => {
    await cleanup();
  });
});
