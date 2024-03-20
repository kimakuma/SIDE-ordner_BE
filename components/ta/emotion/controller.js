import axios from 'axios';
import config from 'config';
import * as service from './service.js';
import { asyncWrapper } from '../../../lib/middleware/async-wrapper.js';
import { Logger } from '../../../lib/logger/logger.js';

const appConfig = config.get('app');
const logger = Logger(import.meta.url);

export const emotionAnalyze = asyncWrapper(async (req, res) => {
  /* 
  #swagger.tags = ['SAMPLE']
  #swagger.summary = '감성분석'
  #swagger.description = '입력한 문장 배열에 대한 감성분석 API'
  #swagger.parameters['obj'] = {
    in: 'body',
    description: '입력문장으로 감성분석',
    schema: {
        [{"domainId":"kahp","in":"피곤하고 그래서"},
        {"domainId":"kahp","in":"아니 그러니까"}]
    }
  } 
  */
  const params = req.body;
  const response = await service.emot(params);
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
