import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';
import * as reserveService from './reserve-service.js';

export const reserveList = asyncWrapper(async (req, res) => {
  const params = req.validated.query;
  const response = await reserveService.reserveList(params);

  res.send(response);
});

export const truckInfo = asyncWrapper(async (req, res) => {
  const params = req.validated.query;
  const response = await reserveService.truckInfo(params);

  res.send(response);
});

export const reserve = asyncWrapper(async (req, res) => {
  const params = req.validated.body;
  const response = await reserveService.reserve(params);

  res.send(response);
});

export const truckList = asyncWrapper(async (req, res) => {
  const params = req.validated.query;
  const response = await reserveService.truckList(params);

  res.send(response);
});