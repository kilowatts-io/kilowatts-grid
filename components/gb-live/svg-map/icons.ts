import GbBatteryMapIcons from "../icons/battery/country/gb";
import GbForeignMarkets from "../icons/cables/country/gb";
import { GbDispatchableMapIcons } from "../icons/dispatchable/country/gb";
import { GbWindMapIcons } from "../icons/wind/country/gb";

const GeneratorIcons = [
  ...GbWindMapIcons,
  ...GbDispatchableMapIcons,
  ...GbForeignMarkets,
  ...GbBatteryMapIcons
];

export default GeneratorIcons;
