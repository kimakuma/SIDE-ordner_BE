import { db } from '../../lib/mysql/connect.js';
import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';
import * as userService from './user-service.js';

export const login = asyncWrapper(async (req, res) => {
  const params = req.validated.body;
  const response = await userService.login(params);

  res.send(response);	
});