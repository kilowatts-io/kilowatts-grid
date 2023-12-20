import { render, screen, fireEvent } from "@testing-library/react-native";
import * as c from "./cards";
import { urls } from "../services/nav";

const mockLinkingOpenURL = jest.fn();
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: mockLinkingOpenURL,
}));

let mockLondonTime = jest.fn();
jest.mock("../common/utils", () => ({
    londonTime: (x: any) => mockLondonTime(x),
}));

describe("atoms/cards/IncompleteUnknownCategories", () => {
  beforeEach(() => {
    render(<c.IncompleteUnknownCategories />);
    mockLinkingOpenURL.mockClear();
  });

  test("renders text", () => {
    screen.getByText("Help us!");
    screen.getByText(
      "This open-source app is incomplete. We need help to categorise the hundreds of individual balancing mechnism units into the right categories, giving them human readable names and plotting them on the map."
    );
    screen.getByText(
      "All the Unknown values represents balancing mechanism units we haven't yet categorised. We need open-source contributions to complete this work."
    );
    screen.getByText(
      "Please help us by contributing to the project on GitHub."
    );
  });

  test("github link", () => {
    const githubButton = screen.getByTestId("github-repo-link");
    fireEvent.press(githubButton);
    expect(mockLinkingOpenURL).toBeCalledWith(urls.githubRepo);
  });
});

describe("atoms/cards/UnknownUnitGroupCode", () => {
  beforeEach(() => {
    render(<c.UnknownUnitGroupCode />);
  });

  test("renders text", () => {
    screen.getByText("Error");
    screen.getByText(
      "Cannot find details for this generator. Please check the URL and try again."
    );
  });
});

describe("atoms/cards/MissingScreen", () => {
  beforeEach(() => {
    mockLinkingOpenURL.mockClear();
    render(<c.MissingScreen />);
  });

  test("renders expected text", () => {
    screen.getByText("Error");
    screen.getByText("This screen does not exist.");
  });

  test("can click on home link", () => {
    const homeButton = screen.getByText("Reset to Home screen");
    fireEvent.press(homeButton);
    expect(mockLinkingOpenURL).toBeCalledWith(urls.home);
  });
});

describe("atoms/cards/UnitListHeader", () => {

  test("renders loading text with undefined now prop", () => {
    render(<c.UnitListHeader />);
    screen.getByText("Loading data for individual units");
  });

  test("renders live individual unit output and local time if now prop is a Date ", () => {
    const now = new Date(Date.parse("2023-01-01"));
    mockLondonTime.mockReturnValue("NOW");
    render(<c.UnitListHeader now={now} />);
    expect(mockLondonTime).toBeCalledWith(now);
    screen.getByText("Live individual unit output at NOW");
  });

  afterAll(() => {
    mockLondonTime.mockRestore();
  });
});


describe("atoms/cards/UnitGroupScheduleHeader", () => {

    test('renders bmUnit code', () => {
        render(<c.UnitGroupScheduleHeader bmUnit="BMU1" />);
        screen.getByText("BMU1");
    })

    test('renders Upcoming Schedule', () => {
        render(<c.UnitGroupScheduleHeader bmUnit="BMU1" />);
        screen.getByText("Upcoming Schedule");
    })


})