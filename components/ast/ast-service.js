import * as astModel from './ast-model.js';
import { resultConfig } from "./config/index-config.js"
import { Logger } from '../../lib/logger/logger.js';

const logger = Logger(import.meta.url);

export async function keyword(params) {
  const { searchResult } = await astModel.keyword(params);
  const result = searchResult.body.hits?.hits;
  const response = {
    status: "OK",
    message: "OK",
    result: {
      total_count: searchResult.body.hits.total.value,
      rows: []
    }
  }
  
  result.map((data) => {
    response.result.rows.push(resultConfig("keyword", data))
  })
  
  return response
};