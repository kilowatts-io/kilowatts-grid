
import { store } from "@/src/state";
import { CanvasPoint } from "./types";
import { setSelectedUnitGroupCode } from "@/src/state/live";

const MAX_DISTANCE = 10;

const searchPoint = async (
  point: CanvasPoint,
  generatorMapPoints: {
    code: string;
    point: { x: number; y: number };
  }[],
) => {
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
    store.dispatch(setSelectedUnitGroupCode(found.code));
    await new Promise((resolve) => setTimeout(resolve, 100));
    return null;
  }
};

export default searchPoint;
