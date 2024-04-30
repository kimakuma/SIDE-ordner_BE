import { CustomError } from "./custom-error.js";

export class InternalServiceError extends CustomError {
  constructor(data){
    super("Failed", data);
  }
}