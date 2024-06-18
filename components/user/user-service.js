import * as userModel from './user-model.js';
import { resultConfig } from "./config/index-config.js"

export async function signUp(params) {
  const response = {
    status: 200,
    message: "Success",
    results: []
  };

  const check = await userModel.check(params);

  if (check.length == 0) {
    const result = await userModel.signUp(params);
  } else {
    response.status = 400;
    response.message = "이메일 또는 전화번호가 중복되었습니다"
  }

  return response
};


export async function signIn(params) {
  const response = {
    status: 200,
    message: "Success",
    results: []
  };

  const result = await userModel.signIn(params);

  if (result && result.length == 1) {
    result.map((data) => {
      response.results.push(resultConfig("signIn", data))
    });
  } else if (result.length == 0) {
    response.status = 400;
    response.message = "이메일 또는 비밀번호가 틀렸습니다"
  }

  return response
};
