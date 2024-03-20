import axios from 'axios';
import config from 'config';
import * as service from './service.js';
import { asyncWrapper } from '../../../lib/middleware/async-wrapper.js';
import { Logger } from '../../../lib/logger/logger.js';

const appConfig = config.get('app');
const logger = Logger(import.meta.url);

export const autocateSearch = asyncWrapper(async (req, res) => {
  /* 
  #swagger.tags = ['SAMPLE']
  #swagger.summary = '문장 내용 기반 분류 추천'
  #swagger.description = '입력문장 으로 분류 추천API'
  #swagger.parameters['obj'] = {
    in: 'body',
    description: '입력문장으로 분류 추천',
    schema: {
      text : '안녕하세요 건강점진 나오셔서 안내차 전화드렸어요'
    }
  } 
  */
  const params = req.body;
  const response = await service.autocategory(params);
  res.send(response);
  /*
  axios
    .post(`${appConfig.host}:${appConfig.port}/gateway/querylog`, {
      query: params.keyword,
      ...response.meta,
    })
    .then(() => {
      // logger.debug('querylog success');
    })
    .catch(err => {
      logger.error(err);
      logger.error('querylog failed');
    });
    */
});
