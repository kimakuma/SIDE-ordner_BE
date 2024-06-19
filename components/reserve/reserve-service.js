import * as reserveModel from './reserve-model.js';
import { resultConfig } from "./config/index-config.js"

export async function list(params) {
  const response = {
    status: 200,
    message: "Success",
    results: []
  };

  const result = await reserveModel.list(params);

  if (result.length > 0) {
    result.map((data) => {
      response.results.push(resultConfig("list", data))
    });
  } else {
    response.status = 400;
    response.message = "예약 내역이 없슴~"
  }

  return response
};