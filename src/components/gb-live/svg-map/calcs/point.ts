import { GB_SVG_DIMS } from "../path";

const bounds = GB_SVG_DIMS.bounds.land;

const NORTH_RAD = (bounds.north * Math.PI) / 180;
const SOUTH_RAD = (bounds.south * Math.PI) / 180;
const NORMALISED_NORTH_Y = Math.log(Math.tan(Math.PI / 4 + NORTH_RAD / 2));
const NORMALIZED_SOUTH_Y = Math.log(Math.tan(Math.PI / 4 + SOUTH_RAD / 2));

const calculatePoint = (coords: Coords): CanvasPoint => {
  "worklet";
  const { lat, lng: lon } = coords;
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  const normalizedLon =
    (lonRad - (bounds.west * Math.PI) / 180) /
    ((bounds.east * Math.PI) / 180 - (bounds.west * Math.PI) / 180);

  const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

  const normalizedY =
    1 -
    (mercatorY - NORMALIZED_SOUTH_Y) /
      (NORMALISED_NORTH_Y - NORMALIZED_SOUTH_Y);

  return {
    x: normalizedLon * GB_SVG_DIMS.width,
    y: normalizedY * GB_SVG_DIMS.height,
  };
};

export default calculatePoint;
