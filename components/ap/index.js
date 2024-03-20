import express from 'express';
import * as apController from './ap-controller.js';
import * as schema from './config/request-schema.js';
import { validate } from '../../lib/middleware/validate.js';

export const router = express.Router();

// IF_TA_003 :: TA 분석 결과
router.post('/resultTA', validate(schema.resultTA), apController.resultTA);
