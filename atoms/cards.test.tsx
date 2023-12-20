import { render, screen, fireEvent } from "@testing-library/react-native";
import * as c from "./cards";
import { GITHUB_REPO_LINK } from "../common/links";

describe("atoms/cards/IncompleteUnknownCategories", () => {
  const mockLinkingOpenURL = jest.fn();
  jest.mock("react-native/Libraries/Linking/Linking", () => ({
    openURL: mockLinkingOpenURL,
  }));
  beforeEach(() => {
    render(<c.IncompleteUnknownCategories />);
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
    expect(mockLinkingOpenURL).toBeCalledWith(GITHUB_REPO_LINK);
  });
});
