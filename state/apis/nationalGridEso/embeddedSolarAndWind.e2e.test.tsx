import { Provider } from "react-redux";
import { useEmbeddedSolarAndWindQuery } from "./api";
import { renderHook } from "@testing-library/react-native";
import { createStore } from "../../reducer";
import { waitFor } from "@testing-library/react-native";

const wrapper = (props: any) => {
  return <Provider store={createStore()} children={props.children} />;
};

describe("state/apis/nationalGridEspo/embeddedSolarAndWind/useEmbeddedSolarAndWindQuery", () => {
  test("can get data", async () => {
    const r = renderHook(() => useEmbeddedSolarAndWindQuery({}), { wrapper });
    await waitFor(() => r.result.current.status == "fulfilled", {
      timeout: 5000,
    });
    expect(r.result.current.data).toBeDefined();
  }, 5000);
});
