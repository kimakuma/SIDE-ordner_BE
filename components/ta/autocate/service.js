import { Logger } from '../../../lib/logger/logger.js';
import { search } from '../../../lib/elasticsearch/client.js';
import * as model from './model.js';

const logger = Logger(import.meta.url);

export const autocategory = async params => {
  let simpleDTO = {
    text: params.text_kskn,
    id: params.call_id_k,
    this_lcls: params.call_cnsl_lcls,
    this_mcls: params.call_cnsl_mcls,
  };

  let similarity_query = await model.query(simpleDTO);

  let index = similarity_query.index;
  let body = similarity_query.body;

  const searchResult = await search({
    index,
    body,
  });

  let dataList = searchResult.body.hits?.hits;

  //lcls : 중분류, mcls : 소분류
  let categoryMap = new Map();

  let this_cnsl_data =
    simpleDTO.this_lcls !== undefined && simpleDTO.this_mcls !== undefined
      ? simpleDTO.this_lcls + '-' + simpleDTO.this_mcls
      : '입력없음';

  if (dataList.length > 0) {
    dataList.map(ele => {
      if (ele.sort !== undefined) {
        let data_ele = ele._source;
        let category = data_ele.call_cnsl_lcls + '-' + data_ele.call_cnsl_mcls;
        let category_score = ele.sort[0];
        let score_cnt_arr = [1, category_score];
        if (!categoryMap.has(category)) {
          categoryMap.set(category, score_cnt_arr);
        } else {
          score_cnt_arr[0] = categoryMap.get(category)[0] + 1;
          score_cnt_arr[1] = categoryMap.get(category)[1] + category_score;
          categoryMap.set(category, score_cnt_arr);
        }
      }
    });
    // AS-IS : 코사인 유사도 검색 실행 결과로 나타난 분류의 개수 10개 이상 출현시 또는 10개 미만인 경우에는 2개이상 및 스코어 0.2점 초과 또는 스코어 0.5점 이상
    let category_score = new Map();
    for (let k of categoryMap.keys()) {
      let score = categoryMap.get(k)[1] / categoryMap.get(k)[0]; //Math.round((categoryMap.get(k)[1] / categoryMap.get(k)[0]) * 1000) / 1000;
      if (categoryMap.get(k)[0] >= 10) {
        category_score.set(k, categoryMap.get(k)[0]);
      } else if (categoryMap.get(k)[0] >= 2 && score > 0.2) {
        category_score.set(k, categoryMap.get(k)[0]);
      } else if (score >= 0.5) {
        category_score.set(k, categoryMap.get(k)[0]);
      }
    }

    let res_map = new Map([...category_score.entries()].sort((a, b) => b[1] - a[1]));
    let res_arr = [...res_map.keys()];

    let result = {
      id: simpleDTO.id,
      this_cnsl: this_cnsl_data,
      call_cnsl_st: res_arr[0] || '분류없음',
      call_cnsl_nd: res_arr[1] || '분류없음',
      res_in_result: 'N',
      text: simpleDTO.text,
    };

    for (let i = 0; i < res_arr.length; i++) {
      if (i >= 2) break;
      if (res_arr[i].trim() == result.this_cnsl) result.res_in_result = 'Y';
    }
    return result;
  } else {
    let result = {
      id: simpleDTO.id,
      this_cnsl: this_cnsl_data,
      call_cnsl_st: '분류없음',
      call_cnsl_nd: '분류없음',
      res_in_result: 'N',
      text: simpleDTO.text,
    };
    return result;
  }
};
