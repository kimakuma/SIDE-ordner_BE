import express from 'express';
import { validate } from '../../lib/middleware/validate.js';
import * as schema from './config/request-schema.js';
import * as reserveController from './reserve-controller.js';

export const router = express.Router();

/* GET */
router.get('/truckList', validate(schema.truckList), reserveController.truckList);
router.get('/truckDetail', validate(schema.truckDetail), reserveController.truckDetail);
router.get('/list', validate(schema.list), reserveController.list);

/* POST */
router.post('/', validate(schema.reserve), reserveController.reserve);
