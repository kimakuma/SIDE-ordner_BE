import { Logger } from '../../../lib/logger/logger.js';
import * as searchModel from './search-model.js';

const logger = Logger(import.meta.url);

export const simple = async params => {
  const simpleDTO = params;
  const { searchResult, index } = await searchModel.simple(simpleDTO);

  const body = searchResult.body.hits.hits.map(item => ({
    ...item._source,
    highlight: item.highlight,
  }));

  const response = {
    meta: {
      index,
      took: searchResult.body.took,
      total: searchResult.body.hits.total.value,
    },
    body,
  };
  logger.info(JSON.stringify(response.meta));
  return response;
};

export const multi = async params => {
  const multiDTO = params;
  const { searchResult, msearchIndices } = await searchModel.multi(multiDTO);

  // const body = searchResult.body.hits.hits.map(item => {
  //   return {
  //     ...item._source,
  //     highlight: item.highlight
  //   }
  // })

  let total = 0;
  const body = {};
  searchResult.body.responses.forEach((result, i) => {
    body[msearchIndices[i]] = result.hits.hits.map(item => ({
      ...item._source,
      highlight: item.highlight,
    }));
    total += result.hits.total.value;
  });

  const response = {
    meta: {
      index: msearchIndices.join(','),
      took: searchResult.body.took,
      total,
    },
    body,
  };
  logger.info(JSON.stringify(response.meta));
  return response;
};
