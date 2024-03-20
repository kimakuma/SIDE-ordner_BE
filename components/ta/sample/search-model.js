import { search, msearch } from '../../../lib/elasticsearch/client.js';
import * as indexConfig from '../config/index-config.js';
import { Logger } from '../../../lib/logger/logger.js';

const logger = Logger(import.meta.url);

export const simple = async params => {
  const simpleConfig = indexConfig.simple();
  const index = simpleConfig.index.join(',');
  const { field, body } = simpleConfig;

  body.query.bool.must.push({
    multi_match: {
      fields: simpleConfig.field.search,
      query: params.keyword,
    },
  });

  field.highlight.forEach(item => {
    body.highlight.fields[item] = {};
  });

  body._source = field.result;
  body.size = params.size;
  body.from = params.from;

  logger.debug(
    JSON.stringify({
      index,
      body,
    }),
  );

  const searchResult = await search({
    index,
    body,
  });
  return { searchResult, index };
};

export const multi = async params => {
  const multiConfig = indexConfig.multi();
  const msearchBody = [];
  const msearchIndices = [];

  multiConfig.forEach(config => {
    const { index, field, body } = config;

    body.query.bool.must.push({
      multi_match: {
        fields: field.search,
        query: params.keyword,
      },
    });

    field.highlight.forEach(item => {
      body.highlight.fields[item] = {};
    });

    body._source = field.result;
    body.size = params.size;
    body.from = params.from;

    msearchIndices.push(index);
    msearchBody.push({ index }, body);
  });

  // const index = msearchIndices.join(',');

  logger.debug(JSON.stringify(msearchBody));

  const searchResult = await msearch({
    body: msearchBody,
  });

  return { searchResult, msearchIndices };
};
