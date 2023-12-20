import { UnitGroup } from "../common/types";
import * as m from "./maps";
import { render, screen } from "@testing-library/react-native";

const mockUg: UnitGroup = {
  details: {
    name: "My Powerstation",
    coords: {
      lat: 50,
      lng: -3,
    },
    fuelType: "coal",
  },
  units: [],
};

describe("atoms/maps/UnitGroupMap", () => {
  test("can render", () => {
    render(<m.UnitGroupMap ug={mockUg} />);
    console.log = jest.fn();
    expect(screen.debug({})).toMatchSnapshot();
  });
});
