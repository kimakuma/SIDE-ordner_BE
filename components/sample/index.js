import express from 'express';
import { validate } from '../../lib/middleware/validate.js';
import * as schema from './config/request-schema.js';
import * as sampleController from './sample-controller.js';

export const router = express.Router();

router.get('/test', validate(schema.test), sampleController.test);
router.post('/esSample', validate(schema.schemaSample), sampleController.searchSample);