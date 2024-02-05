import { useEmbeddedForecasts } from "./embeddedForecasts";
import { useMels } from "./mels";
import { useMelsPnBoalfs } from "./melsPnBoalfs";

export const useGbLive = () => {
  useMels();
  useMelsPnBoalfs();
  useEmbeddedForecasts();
};
