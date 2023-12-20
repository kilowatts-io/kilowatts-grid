import { render, screen } from "@testing-library/react-native";
import * as m from "./maps.android";

describe("atoms/maps.android/UnitGroupMap", () => {
  test("renders undefined as maps not supported on android yet", () => {
    render(<m.UnitGroupMap />);
    expect(screen.debug()).toBe(undefined);
  });
});
