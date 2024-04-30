import * as kmsModel from './kms-model.js';
import { resultConfig } from "./config/index-config.js"

export async function search(params) {
  const { searchResult } = await kmsModel.search(params);
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
    response.result.rows.push(resultConfig("search", data))
  })
  
  return response
};
