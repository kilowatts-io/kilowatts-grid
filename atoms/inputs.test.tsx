import React from "react";
import { screen, render, fireEvent } from "@testing-library/react-native";

import * as i from "./inputs";

// local mocks

const mockOnChangeText = jest.fn();

describe("atoms/inputs/SearchUnitGroups", () => {
  beforeEach(() => {
    mockOnChangeText.mockClear();
  });

  test("renders placeholder text", () => {
    render(<i.SearchUnitGroups value="" onChangeText={() => {}} />);

    screen.findByText("Search");
  });

  test("renders my value in the input", () => {
    render(<i.SearchUnitGroups value="my value" onChangeText={() => {}} />);

    screen.findByDisplayValue("my value");
  });
  
  test('onChangeText is called when text is entered', () => {
    render(<i.SearchUnitGroups value="" onChangeText={mockOnChangeText} />);

    const input = screen.getByPlaceholderText('Search')
    fireEvent.changeText(input, 'my value')
    expect(mockOnChangeText).toHaveBeenCalledTimes(1)
    expect(mockOnChangeText).toHaveBeenCalledWith('my value')
  })
});
