import * as yup from 'yup';
import { BadRequestError } from '../errors/bad-request-error.js';
import { InternalServiceError } from '../errors/internal-service-error.js';
import { Logger } from '../logger/logger.js';

const logger = Logger(import.meta.url);

export const validate = schema => async (req, res, next) => {
  try {
    if(!schema){
      logger.error(`schema is undefined`);
      next(new InternalServiceError(''));
    }
    const validated = await yup.object(schema).validate({
      body: req.body,
      query: req.query,
      params: req.params
    });

    req.validated = validated;

    return next();
  } catch (err) {
    next(new BadRequestError(err.message));
  }
}