import { createStore } from "../../reducer";
import { sheffieldApi } from "./api";
import { renderHook, cleanup, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import React from "react";

const { useNationalQuery } = sheffieldApi;

const wrapper = (props: any) => {
  return <Provider store={createStore()} children={props.children} />;
};

describe("state/apis/sheffield/national.e2e.test.ts", () => {
  test("useNationalQuery", async () => {
    const p = {
      start: "2023-12-01T12:00:00.000Z",
      end: "2023-12-01T12:30:00.000Z",
    };
    const r = renderHook(() => useNationalQuery(p), { wrapper });
    await waitFor(() => {
      expect(r.result.current.data).toBeDefined();
      expect(r.result.current.data?.length).toBe(2);
      expect(r.result.current.data).toMatchSnapshot();
    });

    r.unmount();
  });

  afterEach(async () => {
    await cleanup();
  });
});
