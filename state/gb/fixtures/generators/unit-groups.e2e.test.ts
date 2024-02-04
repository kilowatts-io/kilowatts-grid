import { BASE_API } from "../../../apis/elexon/api";
import {
  BmUnitMelsSchema,
  query,
  transformResponse,
} from "../../../apis/elexon/mels";
import { getMostRecentMels } from "../../../utils";
import { getCurrentSettlementPeriod } from "../../hooks/now";
import { unitGroups } from "./unit-groups";

const now = new Date();
const sp = getCurrentSettlementPeriod(now);
const MELS_LIMIT_MW = 10;
const queryString = query(sp.fromTo);
const url = `${BASE_API}${queryString}`;

const getCoveredBmUnits = () => {
  const covered = new Set<string>();
  for (const unitGroup of unitGroups) {
    for (const bmUnit of unitGroup.units) {
      covered.add(bmUnit.bmUnit);
    }
  }
  return covered;
};

const checkUnitGroups = (mels: BmUnitMelsSchema) => {
  const covered = getCoveredBmUnits();
  const missed: { unit: string; capacity: number }[] = [];
  for (const mel of mels) {
    if (covered.has(mel.bmUnit)) continue;
    const capacity = getMostRecentMels(now, mel.levels);
    missed.push({ unit: mel.bmUnit, capacity });
  }
  const sorted = missed.sort((a, b) => a.capacity - b.capacity);
  for (const { unit, capacity } of sorted) {
    if(capacity < MELS_LIMIT_MW) continue;
    console.log(`{unit: "${unit}", capacity: ${capacity}},`);
  }
};

const fetchMels = async () => {
  const resp = await fetch(url);
  const json = await resp.json();
  const parsed = transformResponse(json);
  return parsed;
};

describe("state/gb/fixtures/generators/unit-groups.e2e", () => {
  test("should get all units with a mels above MELS_LIMIT_MW", async () => {
    const mels = await fetchMels();
    checkUnitGroups(mels);
  });
});
