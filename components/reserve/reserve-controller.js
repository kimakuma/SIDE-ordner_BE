import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';
import * as reserveService from './reserve-service.js';

export const list = asyncWrapper(async (req, res) => {
  const params = req.validated.query;
  const response = await reserveService.list(params);

  res.send(response);
});