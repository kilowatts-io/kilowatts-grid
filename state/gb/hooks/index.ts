import { useEmbeddedForecasts } from "./embeddedForecasts";
import { useMelsPnBoalfs } from "./melsPnBoalfs";

export const useGbLive = () => {
  useMelsPnBoalfs();
  useEmbeddedForecasts();
};
