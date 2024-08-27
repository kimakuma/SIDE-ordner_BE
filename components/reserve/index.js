import express from 'express';
import { validate } from '../../lib/middleware/validate.js';
import * as schema from './config/request-schema.js';
import * as reserveController from './reserve-controller.js';

export const router = express.Router();

/* GET */
// 예약 내역 리스트
router.get('/reserveList', validate(schema.reserveList), reserveController.reserveList);
// 트럭 정보 (트럭 정보, 메뉴, 예약 일자)
router.get('/truckInfo', validate(schema.truckInfo), reserveController.truckInfo);

/* POST */
// 트럭 예약
router.post('/reserve', validate(schema.reserve), reserveController.reserve);

// TODO]
// 트럭 리스트 -> route 변경
router.get('/truckList', validate(schema.truckList), reserveController.truckList);
