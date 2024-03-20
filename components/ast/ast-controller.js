import axios from 'axios';
import config from 'config';
import * as astService from './ast-service.js';
import { Logger } from '../../lib/logger/logger.js';
import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';

const appConfig = config.get('app');
const logger = Logger(import.meta.url);

export const ast_keyword = asyncWrapper(async (req, res) => {
  /* 
  #swagger.tags = ['AST']
  #swagger.summary = 'AST 키워드검색'
  #swagger.description = 'AST 키워드검색 API'
  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'AST 키워드검색 파라미터',
    schema: {
      keyword: "건강,암",
      bnch_cd: "지부",
    }
  } 
  */
  const params = req.validated.body;
  const response = await astService.keyword(params);

  res.send(response);
});