import { selectors, setSelectedUnitGroupCode } from "../../../state/gb/live";
import { store } from "../../../state/reducer";
import { CanvasPoint } from "./types";
import calculatePoint from "./calcs/point";
import { unitGroups } from "../../../assets/data/units";

export const generatorMapPoints = unitGroups.map((ug) => ({
  code: ug.details.code,
  point: calculatePoint(ug.details.coords),
}));

const searchPoint = (point: CanvasPoint) => {
  const distances = generatorMapPoints
    .map((g) => ({
      ...g,
      dist: Math.sqrt((g.point.x - point.x) ** 2 + (g.point.y - point.y) ** 2),
    }))
    .sort((a, b) => a.dist - b.dist);
  if (distances.length === 0) {
    return;
  }
  for (const found of distances) {
    const isBalancing =
      selectors.unitGroupBalancingDirection(store.getState(), found.code) !=
      "none";
    const isRunning =
      selectors.unitGroupCurrentOutput(store.getState(), found.code).level != 0;
    if (isRunning || isBalancing) {
      store.dispatch(setSelectedUnitGroupCode(found.code));
      return;
    }
  }
};

export default searchPoint;
