import * as userModel from './user-model.js';
import { resultConfig } from "./config/index-config.js"

export async function login(params) {
  const result = await userModel.login(params);
  const response = {
    status: 200,
    message: "Success",
    results: []
  };

  if (result && result.length == 1) {
    result.map((data) => {
      response.results.push(resultConfig("login", data))
    });
  } else if (result.length == 0) {
    response.status = 400;
    response.message = "이메일 또는 비밀번호가 틀렸습니다"
  }

  return response
};
