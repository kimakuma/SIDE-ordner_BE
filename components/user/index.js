import express from 'express';
import { validate } from '../../lib/middleware/validate.js';
import * as schema from './config/request-schema.js';
import * as userController from './user-controller.js';

export const router = express.Router();

router.post('/signUp', validate(schema.signUp), userController.signUp);
router.post('/signIn', validate(schema.signIn), userController.signIn);