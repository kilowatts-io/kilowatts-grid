
import { log } from "../../../utils/logs";
import { useEmbeddedForecasts } from "./embeddedForecasts";
import { useMels } from "./mels";
import { useMelsPnBoalfs } from "./melsPnBoalfs";

export const useGbLive = () => {
    log.info('useGbLive')
    useMels();
    useMelsPnBoalfs()
    useEmbeddedForecasts()
}