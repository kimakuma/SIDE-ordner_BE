import * as apModel from './ap-model.js';
import { resultConfig } from "./config/index-config.js"
import { Logger } from '../../lib/logger/logger.js';

const logger = Logger(import.meta.url);

export async function resultTA(params) {
  const { searchResult } = await apModel.search(params);
  const result = searchResult.body.hits?.hits;
  const response = {
    status: "OK",
    message: "OK"
  }

  response.result = result.length > 0 ? resultConfig("resultTA", result[0]) : {};
  
  return response
};