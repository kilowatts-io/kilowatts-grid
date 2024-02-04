import { GB_SVG_DIMS } from "../path";
import { CanvasPoint } from "../types";

/* given a point on the map, use the Mercator projection to calculate the corresponding coords */
const calculateCoords = (point: CanvasPoint) => {
  "worklet";
  const { x, y } = point;

  // Scale pixel coordinates back to normalized coordinates
  var normalizedLon = x / GB_SVG_DIMS.width;
  var normalizedY = y / GB_SVG_DIMS.height;
  normalizedY = 1 - normalizedY; // Invert Y back
  const bounds = GB_SVG_DIMS.bounds.land;

  // Convert normalized longitude back to radians
  var lonRad =
    normalizedLon *
      ((bounds.east * Math.PI) / 180 - (bounds.west * Math.PI) / 180) +
    (bounds.west * Math.PI) / 180;

  // Invert Mercator projection for latitude
  var normalizedSouthY = Math.log(
    Math.tan(Math.PI / 4 + (bounds.south * Math.PI) / 180 / 2)
  );
  var normalizedNorthY = Math.log(
    Math.tan(Math.PI / 4 + (bounds.north * Math.PI) / 180 / 2)
  );
  var mercatorY =
    normalizedY * (normalizedNorthY - normalizedSouthY) + normalizedSouthY;
  var latRad = 2 * (Math.atan(Math.exp(mercatorY)) - Math.PI / 4);

  // Convert radians back to degrees
  var lat = (latRad * 180) / Math.PI;
  var lon = (lonRad * 180) / Math.PI;

  const coords = { lat, lon };
  return coords;
};

export default calculateCoords;
