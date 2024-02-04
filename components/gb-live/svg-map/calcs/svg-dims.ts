import { GB_SVG_DIMS } from "../path";

const calculateSvgDims = (scale: number) => {
  "worklet";
  return {
    width: GB_SVG_DIMS.width * scale,
    height: GB_SVG_DIMS.height * scale,
  };
};

export default calculateSvgDims;
