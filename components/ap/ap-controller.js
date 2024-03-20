import axios from 'axios';
import config from 'config';
import * as apService from './ap-service.js';
import { Logger } from '../../lib/logger/logger.js';
import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';

const appConfig = config.get('app');
const logger = Logger(import.meta.url);

export const resultTA = asyncWrapper(async (req, res) => {
  /* 
  #swagger.tags = ['AP']
  #swagger.summary = 'TA 분석 결과'
  #swagger.description = 'TA 분석 결과 API'
  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'TA 분석 결과 파라미터',
    schema: {
      bnch_cd: "21",
      rec_id: "20240118_075603_01033778359_1",
      extension_num: "3127",
    }
  } 
  */
  const params = req.validated.body;
  const response = await apService.resultTA(params);

  res.send(response);
});
