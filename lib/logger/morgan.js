import morgan from 'morgan'
import { Logger } from "./logger.js"

const logger = Logger(import.meta.url);

const stream = {
  write: message => {
     logger.info(message);
  },
};

const skip = (_, res) => {
  if (res.req.url === '/querylog') {
    return true
  }
   return false;
};

const morganMiddleware = morgan(
    ':method :url :status', { stream,skip }
);

export default morganMiddleware