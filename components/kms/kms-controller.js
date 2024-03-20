import axios from 'axios';
import config from 'config';
import * as kmsService from './kms-service.js';
import { Logger } from '../../lib/logger/logger.js';
import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';

const appConfig = config.get('app');
const logger = Logger(import.meta.url);

export const kms_search = asyncWrapper(async (req, res) => {
  /* 
  #swagger.tags = ['KMS']
  #swagger.summary = 'KMS 통합검색'
  #swagger.description = 'KMS 통합검색 API'
  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'KMS 통합검색 파라미터',
    schema: {
      srch_type: "0",
      srch_wd: ["건강검진", "내시경"],
      category: ["202402010000004", "202402010000008"],
      start_dt: "20231231000000",
      end_dt: "20240214000000",
      exception_word: "Helvetica",
      order_type: "1",
      org_cd: "22",
      st_row: "1",
      en_row: "10"
    }
  } 
  */
  const params = req.validated.body;
  const response = await kmsService.search(params);

  res.send(response);
});

export const kms_autocomplete = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['KMS']
  #swagger.summary = 'KMS 자동완성'
  #swagger.description = '사용자가 의도한 검색어의 일부만 입력해도 입력한 문자가 포함된 다양한 자동완성어를 추천하는 서비스'
  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'KMS 자동완성 파라미터',
    schema: {
      target: "complete",
      term: "건",
      domain_no: "0",
      mode: "s",
      max_count: "10",
    }
  } 
  */
  const params = req.validated.body;
  const response = await kmsService.getAutocomplete(params);

  res.send(response);
});