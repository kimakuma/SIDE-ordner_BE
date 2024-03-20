import config from 'config';
import axios from 'axios';
import _moment from 'moment';
import * as gatewayConfig from './config/gateway-config.js';
import { search, write } from '../../lib/elasticsearch/client.js';
import { Logger } from '../../lib/logger/logger.js';
const logger = Logger(import.meta.url)
const appConfig = config.get('app');

export const querylog = async (params) => {
  const indices = params.index.split(',').map(s => s.trim()).sort((a,b) => {
    return a < b ? -1 : a > b ? 1 : 0;
  }).join(',');

  // convert string to number
  params.total = params.total * 1;
  params.took = params.took * 1;

  const now = _moment();
  const esMode = 'stats';
  const index = `.openquery-querylog-${now.format('YYYYMMDD')}`;
  const docType = 'doc';
  const payload = {
    indices: indices,
    timestamp: now.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    query: params.query,
    total: params.total,
    took: params.took,
  };

  try {
    await write(esMode, index, docType, payload);
  } catch (err) {
    logger.error(JSON.stringify(payload));
    throw err;
  }  
}

export const popquery = async (params) => {
  const { index, body } = await gatewayConfig.getPopqueryConfig();

  body.query.term.label = params.label;

  try {
    const searchResult = await search({
      index,
      body,
    });

    return { searchResult, index };
  } catch (err) {
    logger.error(JSON.stringify(body));
    throw err;
  }  
};

export const hotquery = async (params) => {
  const { index, body } = await gatewayConfig.getHotqueryConfig();

  body.query.term.label = params.label;
  
  try {
    const searchResult = await search({
      index,
      body,
    });

    return { searchResult, index };
  } catch (err) {
    logger.error(JSON.stringify(body));
    throw err;
  }  
};

export const recommend = async (params) => {
  const { index, body } = await gatewayConfig.getRecommendConfig();

  body.query.bool.must.push(
    { match: { 'keyword.keyword': params.keyword } },
    { match: { label: params.label } }
  );

  try {
    const searchResult = await search({
      index,
      body,
    });

    return { searchResult, index };
  } catch(err) {
    logger.error(JSON.stringify(body));
    throw err;
  }
}

export const related = async (params) => {
  const { index, body } = await gatewayConfig.getRelatedConfig();

  body.query.bool.must.push(
    { match: { 'keyword.keyword': params.keyword } },
    { match: { label: params.label } }
  );

  try {
    const searchResult = await search({
      index,
      body,
    });

    return { searchResult, index };
  } catch (err) {
    logger.error(JSON.stringify(body));
    throw err;
  }  
};

export const theme = async (params) => {
  const { index, body } = await gatewayConfig.getThemeConfig();

  body.query.bool.must.push(
    { match: { 'keywords.keyword': params.keyword } },
    { match: { label: params.label } }
  );

  try {
    const searchResult = await search({
      index,
      body,
    });

    return { searchResult, index };
  } catch (err) {
    logger.error(JSON.stringify(body));
    throw err;
  }
};

export const autocomplete = async (params) => {
  const { index, body } = await gatewayConfig.getAutocompleteConfig(params);

  let keywordFields = [];

  if (params.middle === true) {
    keywordFields.push('keyword.autocomplete_middle');
  } 
  keywordFields.push('keyword.autocomplete');
  keywordFields.push('keyword.prefix^10');
  

  if (params.reverse === true) {
    keywordFields.push('keyword.autocomplete_reverse');
  }

  switch (params.sort) {
    default: 
      body.sort = [
        {
          _score: {
            order: 'desc'
          }
        },
        {
          'weight': {
            order: 'desc'
          }
        },
        {
          'keyword.keyword': {
            order: 'asc'
          }
        }
      ]
      break;
    case 'keyword': 
      body.sort = [
        {
          'keyword.keyword': {
            order: 'asc'
          }
        }
      ]
    case 'weight':
      body.sort = [
        {
          'weight': {
            order: 'desc'
          }
        },
        {
          'keyword.keyword': {
            order: 'asc'
          }
        }
      ]
      break;
  }
  
  body.size = params.size;
  body.query.multi_match = {
    query: params.keyword,
    fields: keywordFields
  }

  keywordFields.forEach((field) => {
    body.highlight.fields[field] = {};
  })

  try {
    const searchResult = await search({
      index,
      body
    });

    return { searchResult, keywordFields };
  } catch(err) {
    logger.error(JSON.stringify(body));
    throw err;
  }
}

export const speller = async (params) => {
  try{
    // const { params } = await params.getSpellerParams(req);
    const queryString = new URLSearchParams(params).toString();
    const url = `${appConfig.host}:${appConfig.port}/service/speller?${queryString}`;
    const gatewayResp = await axios.get(url);
    return {
      status: gatewayResp.status,
      data: gatewayResp.data
    };
  } catch (err) {
    throw err;
  }
}

export const labelCheck = async (params) => {
  const { index, body } = await gatewayConfig.getOpenqueryConfig();

  switch (params.name) {
    case 'popquery':
    case 'hotquery':
      body.query.term = {
        'popquery.label': {
          value: params.label
        },
      };
      break;
    case 'recommend':
      body.query.term = {
        'recommend.label': {
          value: params.label
        },
      };
      break;
    case 'related':
      body.query.term = {
        'related.label': {
          value: params.label
        },
      };
    case 'autocomplete':
      body.query.term = {
        'autocomplete.label': {
          value: params.label
        },
      };
      break;
    case 'theme':
      body.query.term = {
        'theme.label': {
          value: params.label
        }
      }
  }

  try {
    const searchResult = await search({
      index,
      body,
    });

    return { searchResult, index };
  } catch (err) {
    logger.error(JSON.stringify(body));
    throw err;
  }
};