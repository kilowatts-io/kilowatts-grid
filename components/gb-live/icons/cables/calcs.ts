import { CanvasPoint } from "../../svg-map/types";

export const calculateDims = (from: CanvasPoint, to: CanvasPoint) => ({
  x: to.x - from.x,
  y: to.y - from.y
});

export const calculateCableLength = (dims: CanvasPoint) =>
  Math.sqrt(dims.x * dims.x + dims.y * dims.y);
