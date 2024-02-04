import { log } from "../../../utils/logs";
import { store } from "../../reducer";
import {
  setOutputTotalEmbeddedWind,
  setOutputTotalSolar,
  setUpdatedEmbeddedForecasts,
} from "../live";

interface EmbeddedForecastValue {
  capacity: number;
  level: number;
  delta: number;
}

interface EmbeddedForecastResult {
  wind: EmbeddedForecastValue;
  solar: EmbeddedForecastValue;
}

export const updateEmbeddedForecast = (result: EmbeddedForecastResult) => {
  store.dispatch(setOutputTotalEmbeddedWind(result.wind));
  store.dispatch(setOutputTotalSolar(result.solar));
  log.info("updateEmbeddedForecast complete");
  store.dispatch(setUpdatedEmbeddedForecasts());
};
