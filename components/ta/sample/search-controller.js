import axios from 'axios';
import config from 'config';
import * as searchService from './search-service.js';
import { asyncWrapper } from '../../../lib/middleware/async-wrapper.js';
import { Logger } from '../../../lib/logger/logger.js';

const appConfig = config.get('app');
const logger = Logger(import.meta.url);

export const simpleSearch = asyncWrapper(async (req, res) => {
  /* 
  #swagger.tags = ['stock']
  #swagger.summary = 'news, stock 키워드 검색'
  #swagger.description = '키워드로 news, stock 인덱스에 검색하는 API'
  #swagger.parameters['keyword'] = { 
    in: 'query',
    description: '키워드',
    required: true,
    type: 'string'
  }
  #swagger.parameters['size'] = { description: '개수' } 
  #swagger.parameters['from'] = { description: 'from' } 
  */
  const params = req.validated.query;
  const response = await searchService.simple(params);

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

  res.send(response);
});

export const multiSearch = asyncWrapper(async (req, res) => {
  /* 
  #swagger.tags = ['stock']
  #swagger.summary = 'news, stock 키워드 검색'
  #swagger.description = '키워드로 news, stock 인덱스에 검색하는 API'
  #swagger.parameters['keyword'] = { 
    in: 'query',
    description: '키워드',
    required: true,
    type: 'string'
  }
  #swagger.parameters['size'] = { description: '개수' } 
  #swagger.parameters['from'] = { description: 'from' } 
  */
  const params = req.validated.query;
  const response = await searchService.multi(params);

  // Openquery logging
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

  res.send(response);
});

// function gatewayQuerylog(params){
//   gatewayService.setQuerylog(params).then(() => {
//     console.debug('querylog success');
//   })
//   .catch((err) => {
//     console.log(err);
//     console.log('querylog failed')
//   })
// }
