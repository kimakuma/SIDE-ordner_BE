import express from 'express';
import * as controller from './gateway-controller.js';
import { validate } from '../../lib/middleware/validate.js';
import * as schema from './config/gateway-request-schema.js';

export const router = express.Router();

//쿼리 로그 적재
router.post('/querylog', validate(schema.querylogParams), controller.querylog);

//인기 검색어
router.get('/popquery', validate(schema.popquery), controller.popquery);

//급상승 검색어
router.get('/hotquery', validate(schema.hotquery), controller.hotquery);

//추천 검색어
router.get('/recommend', validate(schema.recommend), controller.recommend);

//연관 검색어
router.get('/related', validate(schema.related), controller.related);

//자동완성
router.get('/autocomplete', validate(schema.autocomplete), controller.autocomplete);

//검색어 테마
router.get('/theme', validate(schema.theme), controller.theme);

//오타교정
router.get('/speller', validate(schema.speller), controller.speller);


