import * as sampleModel from './sample-model.js';
import { resultConfig } from "./config/index-config.js"

export async function test(params) {
  const { searchResult } = await sampleModel.test(params);
  const results = searchResult[0];

  const response = {
    status: "OK",
    message: "OK",
    result: {
      total_count: results.length,
      rows: []
    }
  }

  results.map((data) => {
    response.result.rows.push(resultConfig("test", data))
  })
  
  return response
};

export async function search(params) {
  const { searchResult } = await sampleModel.search(params);
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
