import * as i from "./interconnectors";

describe("assets/bmUnits/interconnectors", () => {
  test("all interconnector code4s are unique", () => {
    const codes = i.interconnectors.map((x) => x.code4);
    const uniqueCodes = [...new Set(codes)];
    expect(codes.length).toEqual(uniqueCodes.length);
  });

  test("all interconnector codes2 are unique", () => {
    const codes = i.interconnectors.map((x) => x.code2).flat();
    const uniqueCodes = [...new Set(codes)];
    expect(codes.length).toEqual(uniqueCodes.length);
  });

  test("all market names are unique", () => {
    const names = i.foreignMarkets.map((x) => x.name);
    const uniqueNames = [...new Set(names)];

    expect(names.length).toEqual(uniqueNames.length);
  });
});

describe("assets/bmUnits/interconnectors/extractCode4", () => {
  test("can extract code4 from fullCode", () => {
    expect(i.extractCode4("I_EAD-NEMO1")).toBe("NEMO");
    expect(i.extractCode4("I_III-BRTN")).toBe("BRTN");
  });
});

describe("assets/bmUnits/interconnectors/matchByCode4", () => {
  test("can match a code4 for each interconnector", () => {
    for (const interconnector of i.interconnectors) {
      const mockCode4 = `I_III-${interconnector.code4}`;
      const identified = i.matchByCode4(mockCode4);
      if (!identified) {
        throw new Error(
          `Could not match code4 ${mockCode4} for interconnector ${interconnector.name}`
        );
      }
      if (identified.name !== interconnector.name) {
        throw new Error(
          `Could not match code4 ${mockCode4} for interconnector ${interconnector.name}`
        );
      }
    }
  });
});

describe("assets/bmUnits/interconnectors/extractCode2", () => {
  test("can extract code2 from fullCode", () => {
    expect(i.extractCode2("I_IND-CBST1")).toBe("IN");
    expect(i.extractCode2("I_EAD-NEMO1")).toBe("EA");
  });
});

describe("assets/bmUnits/interconnectors/matchByCode2", () => {
  test("can match a code2 for each interconnector", () => {
    for (const interconnector of i.interconnectors) {
      for (const code2 of interconnector.code2) {
        const fullCode = `I_${code2}A-ABCD1`;
        const identified = i.matchByCode2(fullCode);
        if (!identified) {
          throw new Error(
            `Could not match code2 ${fullCode} for interconnector ${interconnector.name}`
          );
        }
        if (identified.name !== interconnector.name) {
          throw new Error(
            `Could not match code2 ${fullCode} for interconnector ${interconnector.name}`
          );
        }
      }
    }
  });
});

describe("assets/bmUnits/interconnectors/matchInterconnector", () => {
  test("can match a code4 for each interconnector", () => {
    for (const interconnector of i.interconnectors) {
      const mockCode4 = `I_III-${interconnector.code4}`;
      const identified = i.matchInterconnector(mockCode4);
      if (!identified) {
        throw new Error(
          `Could not match code4 ${mockCode4} for interconnector ${interconnector.name}`
        );
      }
      if (identified.name !== interconnector.name) {
        throw new Error(
          `Could not match code4 ${mockCode4} for interconnector ${interconnector.name}`
        );
      }
    }
  });

  test("can match a code2 for each interconnector", () => {
    for (const interconnector of i.interconnectors) {
      for (const code2 of interconnector.code2) {
        const fullCode = `I_${code2}A-ABCD1`;
        const identified = i.matchInterconnector(fullCode);
        if (!identified) {
          throw new Error(
            `Could not match code2 ${fullCode} for interconnector ${interconnector.name}`
          );
        }
        if (identified.name !== interconnector.name) {
          throw new Error(
            `Could not match code2 ${fullCode} for interconnector ${interconnector.name}`
          );
        }
      }
    }
  });

  test("can match I_IBD-ARON1 to BRTN", () => {
    expect(i.matchInterconnector("I_IBD-ARON1")!.name).toBe("Britned");
  });

  test("can match I_I2D-ARON1 to IFA2", () => {
    expect(i.matchInterconnector("I_I2D-ARON1")!.name).toBe("IFA2");
  });

  test("can match I_IEG-NSL1 to NSL", () => {
    expect(i.matchInterconnector("I_IEG-NSL1")!.name).toBe("NSL");
  });

  test("it can match I_EAD-FRAN1 to IFA", () => {
    expect(i.matchInterconnector("I_EAD-FRAN1")!.name).toBe("IFA");
  });
});

describe("assets/bmUnits/interconnectors/isInterconnectorUnit", () => {
  test("can determine I_IBD-ARON1 is for an interconnector", () => {
    expect(i.isInterconnectorUnit("I_IBD-ARON1")).toBe(true);
  });

  test("can determine T_DRAXX-1 is not an interconnector", () => {
    expect(i.isInterconnectorUnit("T_DRAXX-1")).toBe(false);
  });
});
