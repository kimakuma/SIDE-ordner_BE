import { CustomError } from "./custom-error.js";

export class BadGatewayError extends CustomError {
  constructor(data){
    super('Failed', data);
  }
}