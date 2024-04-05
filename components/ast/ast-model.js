import axios from 'axios';
import { indexConfig, filterConfig } from "./config/index-config.js"
import { Logger } from '../../lib/logger/logger.js';
import { search as esSearch } from '../../lib/elasticsearch/client.js';

const logger = Logger(import.meta.url);

export async function keyword(params) {
  const searchConfig = indexConfig()["keyword"];
  const index = searchConfig.index;
  const body = searchConfig.body;

  const keywords = params.keyword.split(" ");

  body.from = 0;
  body.size = 15;
  body._source = searchConfig.field.result;

  // must - 검색어
  // keywords.map((data) => {
  //   body.query.bool.must.push({
  //     multi_match: {
  //       fields: searchConfig.field[`search`],
  //       query: data,
  //       auto_generate_synonyms_phrase_query: "false",
  //     }
  //   })
  // })
  body.query.bool.must.push({
    multi_match: {
      fields: searchConfig.field[`search`],
      query: params.keyword,
      auto_generate_synonyms_phrase_query: "false",
    }
  })

  // should - 검색어 좋아요 건 수 score 적용
  keywords.map((data) => {
    body.query.bool.should[0].nested.query.bool.should.push({
      bool: {
        must: [
          {
            match: {
              "POSITIVE_kwd.keyword": data
            }
          },
          {
            function_score: {
              script_score: {
                script: {
                  source: "Math.log(2 + doc['POSITIVE_kwd.weight'].value)"
                }
              }
            }
          }
        ]
      }
    })
  });

  // must_not - 싫어요 많은 건 수 제외
  keywords.map((data) => {
    body.query.bool.must_not[0].nested.query.bool.should.push({
      bool: {
        must: [
          {
            match: {
              "NEGATIVE_kwd.keyword": data
            }
          },
          {
            "range": {
              "NEGATIVE_kwd.weight": {
                "gt": 5
              }
            }
          }
        ]
      }
    })
  });

  // filter - use_yn
  filterConfig("keyword", params).map((data) => body.query.bool.filter.push(data))

  // sort
  body.sort = [
    {
      _score: {
        order: "desc"
      }
    }
  ];

  logger.debug(`IF_TA_007_KMS 키워드검색 Params :: ${JSON.stringify(params)}`);
  logger.debug(`IF_TA_007_KMS 키워드검색 Query :: ${JSON.stringify(body)}`);
  
  const searchResult = await esSearch({
    index,
    body,
    preference: "kahp",
  });

  return { searchResult }
}