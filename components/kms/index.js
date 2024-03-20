import express from 'express';
import * as kmsController from './kms-controller.js';
import * as schema from './config/request-schema.js';
import { validate } from '../../lib/middleware/validate.js';

export const router = express.Router();

// IF_TA_001 :: KMS 통합검색
router.post('/search', validate(schema.search), kmsController.kms_search);

// IF_TA_002 :: KMS 자동완성
router.post('/autocomplete', validate(schema.autocomplete), kmsController.kms_autocomplete);