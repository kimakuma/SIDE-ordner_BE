import { db } from '../../lib/mysql/connect.js';
import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';
import * as sampleService from './sample-service.js';

export const test = asyncWrapper(async (req, res) => {
  const params = req.validated.body;
  const response = await sampleService.test(params);

  res.send(response);	
});

export const searchSample = asyncWrapper(async (req, res) => {
  const params = req.validated.body;
  const response = await sampleService.searchSample(params);

  res.send(response);
});