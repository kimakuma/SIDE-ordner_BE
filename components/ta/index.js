import express from 'express';
import { validate } from '../../lib/middleware/validate.js';
import * as schema from './config/request-schema.js';
import * as sample from './sample/search-controller.js';
import * as autocate from './autocate/controller.js';
import * as emotion from './emotion/controller.js';
// fix : default export로 변경
export const router = express.Router();

//router.get('/', validate(schema.simple), sample.simpleSearch);
//router.get('/multi', validate(schema.multi), sample.multiSearch);
router.post('/autocate', validate(schema.autocate), autocate.autocateSearch);
router.post('/emotion', validate(schema.emotion), emotion.emotionAnalyze);
// export default router;
