import { CustomError } from "./custom-error.js";

export class InternalServiceError extends CustomError {
  constructor(data){
    // super(500, 'Internal Service Error', data);
    super("Failed", data);
  }
}