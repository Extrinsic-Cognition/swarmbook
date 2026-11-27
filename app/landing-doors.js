// The two doors at the end of the landing: SWARM and ANTIMIRROR, both after the
// same $WARM block as on WHY and HOW. Resting sculptures, painted on resize only.
import {createArrivalScene} from './ecology-arrival.js?v=uneven-growth-1';
import {createHowArrivalScene} from './how-arrival.js?v=doors-2';

const swarm = document.getElementById('arrival-swarm');
const antimirror = document.getElementById('arrival-antimirror');
if (swarm && antimirror && 'ResizeObserver' in window) {
  const doors = [createArrivalScene(swarm, 'join'), createHowArrivalScene(antimirror, 'solo')];
  const size = new ResizeObserver(() => { for (const door of doors) { door.resize(); door.render(0, true); } });
  size.observe(swarm);
  size.observe(antimirror);
}
