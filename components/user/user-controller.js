import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';
import * as userService from './user-service.js';

export const signUp = asyncWrapper(async (req, res) => {
  const params = req.validated.body;
  const response = await userService.signUp(params);

  res.send(response);
});

export const signIn = asyncWrapper(async (req, res) => {
  const params = req.validated.body;
  const response = await userService.signIn(params);

  res.send(response);
});