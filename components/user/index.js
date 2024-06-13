import express from 'express';
import { validate } from '../../lib/middleware/validate.js';
import * as schema from './config/request-schema.js';
import * as userController from './user-controller.js';

export const router = express.Router();

// router.post('/signup', validate(schema.signup), userController.signup);
router.post('/login', validate(schema.login), userController.login);