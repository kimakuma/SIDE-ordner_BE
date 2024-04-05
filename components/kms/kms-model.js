import axios from 'axios';
import { indexConfig, filterConfig, sortConfig } from "./config/index-config.js"
import { Logger } from '../../lib/logger/logger.js';
import { search as esSearch } from '../../lib/elasticsearch/client.js';

const logger = Logger(import.meta.url);

export async function search(params) {
  const searchConfig = indexConfig()["search"];
  const index = searchConfig.index;
  const body = searchConfig.body;

  body.from = params.st_row;
  body.size = params.en_row - params.st_row + 1;
  body._source = searchConfig.field.result;

  const mappingFields = [];
  const mapping = {
    0: [0, 5],
    1: [1, 3],
    2: [3],
    3: [4]
  }

  params.srch_type.map((data) => {
    mappingFields.push(searchConfig.field.search.slice(mapping[data][0], mapping[data][1]));
  })
  
  const fields = mappingFields.flat();

  // must - 검색어
  params.srch_wd.map((data) => {
    body.query.bool.must.push({
      multi_match: {
        fields: fields,
        query: data,
        auto_generate_synonyms_phrase_query: "false"
      }
    })
  })

  // must_not - 제외단어
  if (params.exception_word && params.exception_word.length > 0) {
    params.exception_word.map((data) => {
      body.query.bool.must_not.push({
        multi_match: {
          fields: searchConfig.field.search,
          query: data,
          auto_generate_synonyms_phrase_query: "false"
        }
      })
    }) 
  }

  // filter - use_yn, 카테고리, 등록일 범위, 조직 코드
  filterConfig("search", params).map((data) => body.query.bool.filter.push(data))

  // sort
  body.sort = sortConfig("search", params.order_type)

  logger.debug(`IF_TA_001_KMS 통합검색 Params :: ${JSON.stringify(params)}`);
  logger.debug(`IF_TA_001_KMS 통합검색 Query :: ${JSON.stringify(body)}`);
  
  const searchResult = await esSearch({
    index,
    body,
    preference: "kahp",
  });

  return { searchResult }
}

export const autocomplete = async (params) => {
  const searchConfig = indexConfig()["autocomplate"];
  const index = searchConfig.index;
  const body = searchConfig.body;
  
  body.from = 0;
  body.size = 0;
  body._source = searchConfig.field.result;

  // must - 검색어
  body.query.bool.must.push({
    multi_match: {
      query: params.term,
      fields: searchConfig.field[`search_${params.mode}`],
      auto_generate_synonyms_phrase_query: "false",
    }
  })

  // filter - 도메인 번호
  filterConfig("autocomplete", params).map((data) => body.query.bool.filter.push(data))

  // aggs - 중복 제거
  body.aggs = searchConfig.aggs;

  logger.debug(`IF_TA_002_KMS 자동완성 Params :: ${JSON.stringify(params)}`);
  logger.debug(`IF_TA_002_KMS 자동완성 Query :: ${JSON.stringify(body)}`);

  const searchResult = await esSearch({
    index,
    body
  });

  return { searchResult };
}