import axios from 'axios';
import { indexConfig, filterConfig } from "./config/index-config.js"
import { Logger } from '../../lib/logger/logger.js';
import { search as esSearch, update } from '../../lib/elasticsearch/client.js';

const logger = Logger(import.meta.url);

export async function keyword(params) {
  const searchConfig = indexConfig()["keyword"];
  const index = searchConfig.index;
  const body = searchConfig.body;

  const keywords = params.keyword.split(",");

  body.from = 0;
  body.size = 15;
  body._source = searchConfig.field.result;

  // must - 검색어
  keywords.map((data) => {
    body.query.bool.must.push({
      multi_match: {
        fields: searchConfig.field[`search`],
        query: data,
        auto_generate_synonyms_phrase_query: "false",
      }
    })
  })

  // filter - use_yn
  filterConfig("keyword", params).map((data) => body.query.bool.filter.push(data))

  logger.debug(`IF_TA_007_KMS 키워드검색 Params :: ${JSON.stringify(params)}`);
  logger.debug(`IF_TA_007_KMS 키워드검색 Query :: ${JSON.stringify(body)}`);
  
  const searchResult = await esSearch({
    index,
    body,
  });

  return { searchResult }
}