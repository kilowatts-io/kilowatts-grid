import { unitGroups } from "./unit-groups";

describe("unitGroups", () => {
  test("maximum Length of name is less than x", () => {
    // find the longest name

    const sorted = unitGroups.sort((a, b) => {
      return b.details.name.length - a.details.name.length;
    });

    const longest = sorted[0].details.name.length;

    expect(longest).toBeLessThan(19);
  });
});
