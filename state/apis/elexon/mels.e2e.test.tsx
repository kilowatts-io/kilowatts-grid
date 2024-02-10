import React from "react";
import { Provider } from "react-redux";
import { cleanup, renderHook, waitFor } from "@testing-library/react-native";

import { createStore } from "../../reducer";

import { elexonApi } from "./api";

const { useMelsQuery } = elexonApi;

const wrapper = (props: any) => {
  return (
    <Provider
      store={createStore()}
      children={props.children}
    />
  );
};

describe("mels", () => {
  test("useMelsQuery", async () => {
    const p = {
      from: "2023-12-01T00:00:00Z",
      to: "2023-12-01T00:30:00Z"
    };
    const r = renderHook(() => useMelsQuery(p), { wrapper });
    await waitFor(() => {
      expect(r.result.current.data).toBeDefined();
      expect(r.result.current.data?.length).toBeGreaterThan(0);
      expect(r.result.current.data).toMatchSnapshot();
      console.log(r.result.current.data);
    });

    r.unmount();
    return null;
  }, 5000);

  afterEach(async () => {
    await cleanup();
  });
});
