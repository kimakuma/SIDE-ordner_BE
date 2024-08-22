import * as reserveModel from './reserve-model.js';
import { resultConfig } from "./config/index-config.js"

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

export async function truckDetail(params) {
  const response = {
    status: 200,
    message: "Success",
    results: {
      truckInfo: {},
      truckMenuList: [],
    }
  };

  const result_truckInfo = await reserveModel.truckInfo(params);
  const result_truckMenuList = await reserveModel.truckMenuList(params);

  if (result_truckInfo.length > 0) {
    result_truckInfo.map((data) => {
      response.results.truckInfo = resultConfig("truckInfo", data);
    });

    if (result_truckMenuList.length > 0) {
      result_truckMenuList.map((data) => {
        response.results.truckMenuList.push(resultConfig("truckMenuList", data));
      });
    }
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

export async function reserve(params) {
  const now = new Date();
  const response = {
    status: 200,
    message: "Success",
  };

  const result = await reserveModel.reserve(params);

  if (result > 0) {
    response.message = "예약이 완료되었습니다";
  } else {
    response.status = 400;
    response.message = "이미 예약된 날짜입니다";
  }

  return response;
}
