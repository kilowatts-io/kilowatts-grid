import { setSelectedUnitGroupCode } from "../../../state/gb/live";
import { store } from "../../../state/reducer";
import { CanvasPoint } from "./types";
import calculatePoint from "./calcs/point";
import { unitGroups } from "../../../state/gb/fixtures/generators/unit-groups";

export const generatorMapPoints = unitGroups.map((ug) => ({
  code: ug.details.code,
  point: calculatePoint(ug.details.coords),
}));

export const unitGroupMapPointDict = {}
for (const point of generatorMapPoints) {
  unitGroupMapPointDict[point.code] = point.point
}

const MAX_DISTANCE = 10;

const searchPoint = async (point: CanvasPoint) => {
  const distances = generatorMapPoints
    .map((g) => ({
      ...g,
      dist: Math.sqrt((g.point.x - point.x) ** 2 + (g.point.y - point.y) ** 2),
    }))
    .sort((a, b) => a.dist - b.dist);
  if (distances.length === 0) return;
  for (const found of distances) {
    if (!found.code) continue;
    if (found.dist > MAX_DISTANCE) break;
    const balancing = store.getState().gbLiveSlice.unitGroups.balancingVolume[found.code];
    const notBalancing = ! balancing || balancing === 0;
    const currentOutput = store.getState().gbLiveSlice.unitGroups.currentOutput[found.code];
    if(!currentOutput) continue
    const inactive = notBalancing && currentOutput.level === 0;
    if(inactive) continue
    store.dispatch(setSelectedUnitGroupCode(found.code));
    await new Promise((resolve) => setTimeout(resolve, 100));
    return null;
  }
};

export default searchPoint;
