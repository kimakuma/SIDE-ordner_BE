import express from 'express';
import * as kmsController from './kms-controller.js';
import * as schema from './config/request-schema.js';
import { validate } from '../../lib/middleware/validate.js';

export const router = express.Router();

router.post('/search', validate(schema.search), kmsController.kms_search);