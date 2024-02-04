import { createStore } from "../../reducer";
import { elexonApi } from "./api";
import { Provider } from "react-redux";
import React from "react";
import { renderHook, cleanup, waitFor } from "@testing-library/react-native";

const { useBoalfQuery } = elexonApi;

const wrapper = (props: any) => {
  return <Provider store={createStore()} children={props.children} />;
};


describe("state/apis/elexon/boalf.e2e.test.ts", () => {
  test("useBoalfQuery", async() => {
    const p = {
      from: '2023-12-01T00:00:00.000Z',
      to: '2023-12-01T00:00:29.000Z',
    };
    const r = renderHook(
      () =>
        useBoalfQuery(p),
      { wrapper }
    );

    await waitFor(() => {
      expect(r.result.current.data).toBeDefined();
      expect(r.result.current.data?.length).toBeGreaterThan(0);
      expect(r.result.current.data).toMatchSnapshot();
    });

    r.unmount();
  }, 5000);

  afterEach(async () => {
    await cleanup();
  });
});
