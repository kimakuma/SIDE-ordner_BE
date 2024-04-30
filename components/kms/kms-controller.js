import * as kmsService from './kms-service.js';
import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';

export const kms_search = asyncWrapper(async (req, res) => {
  const params = req.validated.body;
  const response = await kmsService.search(params);

  res.send(response);
});