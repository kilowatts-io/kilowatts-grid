// import { cleanup, renderHook } from "@testing-library/react-hooks";
import { renderHook, cleanup } from "@testing-library/react-native";

import { useUseGroupsLiveQuery } from "./unitGroupsLive";
import { createStore } from "../reducer";
import { Provider } from "react-redux";
import React from "react";

const wrapper = (props: any) => {
  return <Provider store={createStore()} children={props.children} />;
};

const TIMEOUT_MS = 5000;

jest.setTimeout(TIMEOUT_MS);

describe("state/hooks/unitGroupsLive.e2e.test.tsx", () => {
  beforeEach(async () => {
    await cleanup();
  });

  test("useUnitGroupsLiveQuery/returns data", async () => {
    const started = Date.now();
    const { result, waitFor } = renderHook(() => useUseGroupsLiveQuery(), {
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
    if (!data?.generators) throw new Error("no generators data returned");
    const { generators, foreignMarkets } = data;

    // check the largest (i.e. first generator has an output above 200)
    const largestGenerator = generators[0];
    expect(largestGenerator.output.postBm.actual).toBeGreaterThan(200);
    // print the largest generator
    console.log(`largest generator: ${JSON.stringify(largestGenerator)}`);

    // check there are at least 20 generators which have isRunning === true
    const runningGenerators = generators.filter(
      (g) => g.output.postBm.actual > 0
    );
    expect(runningGenerators.length).toBeGreaterThan(20);

    // print largest foreign market
    const largestForeignMarket = foreignMarkets[0];
    console.log(
      `largest foreign market: ${JSON.stringify(largestForeignMarket)}`
    );

    const completed = Date.now();
    const duration = completed - started;
    console.log(`useUnitGroupsLiveQuery took ${duration}ms`);


  });



  afterEach(async () => {
    await cleanup();
  });
});
