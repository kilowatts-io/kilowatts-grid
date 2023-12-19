import { MissingScreen } from '../atoms/cards';
import log from '../services/log';

export default function NotFoundScreen() {
  log.debug(`NotFoundScreen`)
  return (
    <MissingScreen/>
  );
}

