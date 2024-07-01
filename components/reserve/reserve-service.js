import * as reserveModel from './reserve-model.js';
import { resultConfig } from "./config/index-config.js"

export async function truckList(params) {
  const response = {
    status: 200,
    message: "Success",
    results: []
  };

  const result = await reserveModel.truckList(params);

  console.log(result)

  if (result.length > 0) {
    result.map((data) => {
      response.results.push(resultConfig("truckList", data));
    });
  } else {
    response.status = 400;
    response.message = "None Data"
  }

  return response
};

export async function list(params) {
  const now = new Date();
  const response = {
    status: 200,
    message: "Success",
    results: {
      "before": [],
      "ing": [],
      "after": []
    }
  };

  const result = await reserveModel.list(params);

  if (result.length > 0) {
    result.map((data) => {
      const start = data.startDate;
      const end = data.endDate;

      if (now < start && now < end) {
        response.results.before.push(resultConfig("list", data));
      } else if (start <= now && now <= end) {
        response.results.ing.push(resultConfig("list", data));
      } else if (end < now) {
        response.results.after.push(resultConfig("list", data));
      }
    });
  } else {
    response.status = 400;
    response.message = "None Data"
  }

  return response
};