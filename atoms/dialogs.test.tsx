import { screen, render, fireEvent } from "@testing-library/react-native";
import * as d from "./dialogs";
import { urls } from "../services/nav";

// local mocks
const mockOnAccept = jest.fn();
const mockOnBackdropPress = jest.fn();
const mockLinkingOpenURL = jest.fn();

// mock Linking.openUrl
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: mockLinkingOpenURL,
}));

//modk useRouter
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockLinkingOpenURL,
  }),
}));

// mock getCurrentYear
jest.mock("../common/utils", () => ({
  getCurrentYear: () => 2021,
}));

describe("atoms/dialogs/ConsentDialog/invisible", () => {
  test("is not visible", () => {
    render(<d.ConsentDialog isVisible={false} onAccept={() => {}} />);
    screen.getByTestId("consent-dialog");
  });
});

describe("atoms/dialogs/ConsentDialog/preaccepance", () => {
  beforeEach(() => {
    mockOnAccept.mockClear();
    mockOnBackdropPress.mockClear();
    mockLinkingOpenURL.mockClear();
    render(<d.ConsentDialog isVisible={true} onAccept={mockOnAccept} />);
  });

  test("is visible", () => {
    screen.getByTestId("consent-dialog");
  });

  test("has expected text", () => {
    screen.getByText("kilowatts.io");
    screen.getByText(
      "This app is provided without any warranty. Use at your own risk."
    );
    screen.getByText(
      "Contains BMRS data © Elexon Limited copyright and database right 2021."
    );
    screen.getByText("View Elexon License");
  });

  test('onAccept is called when "I agree" is pressed', () => {
    const btn = screen.getByText("I agree");
    expect(mockOnAccept).toHaveBeenCalledTimes(0);
    fireEvent.press(btn);
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  test("press on View Elexon License triggers Linking.openURL call to urls.elexonLicense", () => {
    const btn = screen.getByText("View Elexon License");
    fireEvent.press(btn);
    expect(mockLinkingOpenURL).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenURL).toHaveBeenCalledWith(urls.elexonLicense);
  });

  test("View App Privacy Policy is not visible yet", () => {
    try {
      screen.getByText("View App Privacy Policy");
      throw new Error("View App Privacy Policy should not be visible yet");
    } catch (e: any) {
     
    }
  });
});

describe("atoms/dialogs/ConsentDialog/postacceptance", () => {
  beforeEach(() => {
    mockOnAccept.mockClear();
    mockOnBackdropPress.mockClear();
    mockLinkingOpenURL.mockClear();
    render(
      <d.ConsentDialog
        isVisible={true}
        onAccept={mockOnAccept}
        onBackdropPress={mockOnBackdropPress}
      />
    );
  });

  test("press on View App Privacy Policy triggers router.replace call to urls.privacy", () => {
    const btn = screen.getByText("View App Privacy Policy");
    fireEvent.press(btn);
    expect(mockLinkingOpenURL).toHaveBeenCalledTimes(1);
    expect(mockLinkingOpenURL).toHaveBeenCalledWith(urls.privacy);
  });
});
