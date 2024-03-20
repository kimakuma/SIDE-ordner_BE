import { CustomError } from "./custom-error.js";

export class BadRequestError extends CustomError {
  constructor(data){
    super('Failed', data);
  }
}