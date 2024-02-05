import { selectors, setSelectedUnitGroupCode } from "../../../state/gb/live";
import { store } from "../../../state/reducer";
import { CanvasPoint } from "./types";
import calculatePoint from "./calcs/point";
import { unitGroups } from "../../../state/gb/fixtures/generators/unit-groups";

export const generatorMapPoints = unitGroups.map((ug) => ({
  code: ug.details.code,
  point: calculatePoint(ug.details.coords),
}));

const MAX_DISTANCE = 7.5;

const trySearchPoint = (point: CanvasPoint) => {
  const distances = generatorMapPoints
    .map((g) => ({
      ...g,
      dist: Math.sqrt((g.point.x - point.x) ** 2 + (g.point.y - point.y) ** 2),
    }))
    .sort((a, b) => a.dist - b.dist);
  if (distances.length === 0) return;
  for (const found of distances) {
    if (!found.code) continue;
    const isBalancing =
      selectors.unitGroupBalancingDirection(store.getState(), found.code) !=
      "none";
    const isRunning =
      selectors.unitGroupCurrentOutput(store.getState(), found.code).level != 0;
    if (!isRunning && !isBalancing) continue;
    if (found.dist < MAX_DISTANCE) {
      store.dispatch(setSelectedUnitGroupCode(found.code));
      return;
    }
  }
  console.log("No active unit group found within 5 pixels of the click.");
};

const searchPoint = (point: CanvasPoint) => {
  try {
    trySearchPoint(point);
  } catch (e) {
    console.error(e);
  }
};

export default searchPoint;
