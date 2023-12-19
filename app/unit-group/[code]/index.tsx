import { UnitGroupLive } from "../../../components/UnitGroupLive";
import WithUnitGroupCode from "../../../components/WithUnitGroupCode";
import log from "../../../services/log";

export const UnitGroupScreen = () => {
  log.debug('UnitGroupScreen');
  return (
    <WithUnitGroupCode component={UnitGroupLive} />
  )
}
export default UnitGroupScreen;
