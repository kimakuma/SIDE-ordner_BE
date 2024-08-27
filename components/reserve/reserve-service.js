import * as reserveModel from './reserve-model.js';
import { resultConfig } from "./config/index-config.js"

export async function reserveList(params) {
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

  const result = await reserveModel.reserveList(params);

  if (result.length > 0) {
    result.map((data) => {
      const start = data.startDate;
      const end = data.endDate;

      if (now < start && now < end) {
        response.results.before.push(resultConfig("reserveList", data));
      } else if (start <= now && now <= end) {
        response.results.ing.push(resultConfig("reserveList", data));
      } else if (end < now) {
        response.results.after.push(resultConfig("reserveList", data));
      }
    });
  } else {
    response.status = 400;
    response.message = "None Data"
  }

  return response
};

export async function truckInfo(params) {
  const response = {
    status: 200,
    message: "Success",
    results: {
      truckInfo: {},
      truckMenuList: [],
      truckSchedule: []
    }
  };

  const result_truckInfo = await reserveModel.truckInfo(params);
  const result_truckMenuList = await reserveModel.truckMenuList(params);
  const result_truckSchedule = await reserveModel.truckSchedule(params);

  if (result_truckInfo.length > 0) {
    result_truckInfo.map((data) => {
      response.results.truckInfo = resultConfig("truckInfo", data);
    });

    if (result_truckMenuList.length > 0) {
      result_truckMenuList.map((data) => {
        response.results.truckMenuList.push(resultConfig("truckMenuList", data));
      });
    }

    if (result_truckSchedule.length > 0) {
      const tempResult = [];
      result_truckSchedule.map((data) => {
        tempResult.push(resultConfig("truckSchedule", data));
      });

      response.results.truckSchedule.push(tempResult.flat());
    }
  } else {
    response.status = 400;
    response.message = "None Data"
  }

  return response
};

export async function reserve(params) {
  const now = new Date();
  const response = {
    status: 200,
    message: "Success",
  };

  const reserveCheck = await reserveModel.reserveCheck(params);
  if (reserveCheck.length > 0) {
    response.status = 400;
    response.message = "Pre Reserved";
  } else {
    const result = await reserveModel.reserve(params);

    if (result <= 0) {
      response.status = 500;
      response.message = "DB Err";
    }
  }

  return response;
}

export async function truckList(params) {
  const response = {
    status: 200,
    message: "Success",
    results: []
  };

  const result = await reserveModel.truckList(params);

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