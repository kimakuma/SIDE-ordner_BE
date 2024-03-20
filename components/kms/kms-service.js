import * as kmsModel from './kms-model.js';
import { resultConfig } from "./config/index-config.js"
import { Logger } from '../../lib/logger/logger.js';

const logger = Logger(import.meta.url);

export async function search(params) {
  const { searchResult } = await kmsModel.search(params);
  const result = searchResult.body.hits?.hits;
  const response = {
    status: "OK",
    message: "OK",
    result: {
      total_count: searchResult.body.hits.total.value,
      rows: []
    }
  }
  
  result.map((data) => {
    response.result.rows.push(resultConfig("search", data))
  })
  
  return response
};

export const getAutocomplete = async (params) => {
  const { searchResult } = await kmsModel.autocomplete(params);
  const result = searchResult.body.aggregations?.aggs.buckets;

  const response = {
    status: "OK",
    message: "OK",
    result: {
      items: []
    }
  }
  
  result.slice(0, params.max_count).map((data) => {
    response.result.items.push(resultConfig("autocomplete", data))
  })
  
  return response
  

  //   gatewayResp.searchResult.body.hits.hits.forEach(async (hit) => {
  //     let item = {
  //       keyword: hit._source.keyword,
  //       highlight: hit._source.keyword,
  //       weight: hit._source.weight,
  //       custom: JSON.parse(hit._source.custom),
  //     };

  //     if (hit.highlight) {
  //       item.highlight = await highlightReplace(
  //         item.keyword,
  //         gatewayResp.keywordFields,
  //         hit.highlight
  //       );
  //     }

  //     autocompleteArr.push(item);
  //   });
  // }
  // return autocompleteArr;
};

const highlightReplace = async (value, fields, highlight) => {
  if (value.constructor === Array) {
    let ret = [];

    value.forEach((v) => {
      let every = fields.every((f) => {
        if (
          highlight[f] &&
          v === highlight[f][0].replace(/¶HS¶/g, '').replace(/¶HE¶/g, '')
        ) {
          ret.push(highlight[f][0]);
          return false;
        }
        return true;
      });
      if (every === true) {
        ret.push(v);
      }
    });

    return ret;
  } else {
    let ret = '';

    let every = fields.every((f) => {
      if (highlight[f]) {
        ret = highlight[f][0];

        return false;
      }
      return true;
    });

    return every === true ? value : ret;
  }
};
