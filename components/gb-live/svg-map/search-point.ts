import { setSelectedUnitGroupCode } from "../../../state/gb/live";
import { store } from "../../../state/reducer";

import { CanvasPoint } from "./types";

// export const generatorMapPoints = unitGroups.map((ug) => ({
//   code: ug.details.code,
//   point: calculatePoint(ug.details.coords)
// }));

// export const unitGroupMapPointDict = {};
// for (const point of generatorMapPoints) {
//   unitGroupMapPointDict[point.code] = point.point;
// }

const MAX_DISTANCE = 10;

const searchPoint = async (
  point: CanvasPoint,
  generatorMapPoints: {
    key: string;
    point: { x: number; y: number };
  }[]
) => {
  const distances = generatorMapPoints
    .map((g) => ({
      ...g,
      dist: Math.sqrt((g.point.x - point.x) ** 2 + (g.point.y - point.y) ** 2)
    }))
    .sort((a, b) => a.dist - b.dist);
  if (distances.length === 0) return;
  for (const found of distances) {
    if (!found.key) continue;
    if (found.dist > MAX_DISTANCE) break;
    store.dispatch(setSelectedUnitGroupCode(found.key));
    await new Promise((resolve) => setTimeout(resolve, 100));
    return null;
  }
};

export default searchPoint;
