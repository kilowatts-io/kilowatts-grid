import { useEmbeddedForecasts } from "./embeddedForecasts";
import { useMelsPnBoalfs } from "./melsPnBoalfs";

export const useGbLive = () => {
  const bm = useMelsPnBoalfs();
  const emb = useEmbeddedForecasts();
  return () => {
    bm();
    emb();
  };
};
