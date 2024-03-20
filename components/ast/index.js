import express from 'express';
import * as astController from './ast-controller.js';
import * as schema from './config/request-schema.js';
import { validate } from '../../lib/middleware/validate.js';

export const router = express.Router();

// IF_TA_007 :: KMS 키워드검색
router.post('/keyword', validate(schema.keyword), astController.ast_keyword);