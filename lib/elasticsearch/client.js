import { Client, errors as esErrors } from '@elastic/elasticsearch';
import config from 'config';
import { BadGatewayError } from '../errors/bad-gateway-error.js';
import { Logger } from '../logger/logger.js';

const logger = Logger(import.meta.url);

/**
 * 
 node: {
  url: new URL('http://localhost:9200'),
  ssl: 'ssl options',
  agent: 'http agent options',
  id: 'custom node id',
  headers: { 'custom': 'headers' }
  roles: {
    master: true,
    data: true,
    ingest: true,
    ml: false
  }
}
*/

const client = new Client({
  node: config.get('elasticsearch.nodes'),
});

const handleError = err => {
  logger.error(`${err.name}: ${err.message}`);
  if (err instanceof esErrors.ResponseError) {
    logger.error(JSON.stringify(err.meta.body.error.caused_by));
  }
  throw new BadGatewayError();
};

export const search = async params => {
  try {
    const result = await client.search(params);
    return result;
  } catch (err) {
    handleError(err);
  }
};

export const msearch = async params => {
  try {
    const result = await client.msearch(params);
    return result;
  } catch (err) {
    handleError(err);
  }
};

export const write = async (mode, index, docType, payload, _id) => {
  const param = {
    refresh: true,
    index,
    type: docType,
    id: _id,
    body: payload,
  };

  try {
    const result = await client.index(param);
    return result;
  } catch (err) {
    logger.error('could not write querylog');
    handleError(err);
  }
};

export const scroll = (mode, scroll, scrollId) => {
  const param = {
    scrollId,
    rest_total_hits_as_int: true,
    scroll,
  };
  return client.scroll(param).catch(err => {
    handleError(err);
  });
};

export const update = async (index, id, body) => {
  const param = {
    index,
    type: "_doc",
    id,
    body
  };

  try {
    const result = await client.update(param);
    return result;
  } catch (err) {
    logger.error('could not write querylog');
    handleError(err);
  }
}