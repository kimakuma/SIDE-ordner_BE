import { CustomError } from "./custom-error.js";

export class NotFoundError extends CustomError {
  constructor(data){
    super("Failed", data);
  }
}