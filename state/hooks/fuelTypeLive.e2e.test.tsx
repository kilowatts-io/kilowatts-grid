// import { cleanup, renderHook } from "@testing-library/react-hooks";
import { renderHook, cleanup } from "@testing-library/react-native";

import { createStore } from "../reducer";
import { Provider } from "react-redux";
import React from "react";
import { useFuelTypeLive } from "./fuelTypeLive";

const wrapper = (props: any) => {
  return <Provider store={createStore()} children={props.children} />;
};

const TIMEOUT_MS = 10000;

jest.setTimeout(TIMEOUT_MS);

describe("state/hooks/fuelTypeLive.e2e.test.tsx", () => {
  beforeEach(async () => {
    await cleanup();
  });

  test("useFuelTypeLive/returns data", async () => {
    const started = Date.now();
    const { result, waitFor } = renderHook(() => useFuelTypeLive(), {
      wrapper,
    });

    await waitFor(
      () => {
        return result.current.data !== null;
      },
      { timeout: TIMEOUT_MS }
    );

    expect(result.current.data).not.toBeNull();
    const { data } = result.current;

    console.log(data)

  });



  afterEach(async () => {
    await cleanup();
  });
});
