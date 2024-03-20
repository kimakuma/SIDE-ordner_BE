import _node_schedule from 'node-schedule';
import { Logger } from '../logger/logger.js';
const logger = Logger(import.meta.url);

import * as speller from '../../components/gateway/util/speller.js';

function runSchedule() {
  const timeSchedule = '0-59/10 * * * * *';
  logger.info('speller update schedule started | ' + timeSchedule);

  let running = false;

  _node_schedule.scheduleJob(timeSchedule, function () {
    if (running === true) {
      logger.info('speller update schedule already running');
      return;
    }

    // set running
    // logger.debug('run speller update schedue');
    running = true;

    speller
      .update()
      .then(() => {
        running = false;
        // logger.debug('speller update schedule completed');
      })
      .catch((err) => {
        running = false;
        logger.error('could not update speller schedule | ' + err.toString());
      });
  });
}

export function spellerSchedule() {
  speller.update().then(() => {
    runSchedule();
  }).catch(err => {
    logger.error('Running spellerSchedule failed');
    setTimeout(spellerSchedule, 5000)
  })
}
