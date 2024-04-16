import axios from 'axios';
import { indexConfig } from "./config/index-config.js"
import { Logger } from '../../lib/logger/logger.js';
import { search as esSearch } from '../../lib/elasticsearch/client.js';

const logger = Logger(import.meta.url);

export async function search(params) {
  const searchConfig = indexConfig()["resultTA"];
  const index = searchConfig.index;
  const body = searchConfig.body;

  body._source = searchConfig.field.result;

  body.query.bool.must.push({
    match: {
      rec_id: params.rec_id
    }
  }, {
    match: {
      bnch_cd: params.bnch_cd
    }
  });

  // logger.debug(`IF_TA_003 TA 분석 결과 Params :: ${JSON.stringify(params)}`);
  // logger.debug(`IF_TA_003 TA 분석 결과 Query :: ${JSON.stringify(body)}`);
  
  const searchResult = await esSearch({
    index,
    body,
  });

  return { searchResult }
}