import * as model from './gateway-model.js';
import * as speller from './util/speller.js'
import * as autocomplete from './util/autocomplete.js'
import _string_placeholder from 'string-placeholder';
import { BadRequestError } from '../../lib/errors/bad-request-error.js';


export const setQuerylog = async (params) => {
  const gatewayResp = await model.querylog(params);
  return gatewayResp;
}

export const getPopquery = async (params) => {
  const popqueryDTO = {
    label: params.label,
    timestamp: params.timestamp || '',
    timestamp: params.timestamp === 'true' ? true : false,
    name: 'popquery',
  };
  
  const gatewayResp = await model.popquery(popqueryDTO);
  if (gatewayResp.searchResult.body.hits.hits.length === 0) {
    const labelResp = await model.labelCheck(popqueryDTO);
    if (labelResp.searchResult.body.hits.hits.length > 0) {
      if (popqueryDTO.timestamp) {
        return { items: [] };
      } else {
        return [];
      }
    } else {
      throw new BadRequestError('The label does not exist.');
    }
  } else {
    const popqueryArr = JSON.parse(
      gatewayResp.searchResult.body.hits.hits[0]._source.popqueryJSON
    );
    if (popqueryDTO.timestamp) {
      return {
        timestamp: gatewayResp.searchResult.hits.hits[0]._source.timestamp,
        items: popqueryArr,
      };
    } else {
      return popqueryArr;
    }
  }
}

export const getHotquery = async (params) => {
  const hotqueryDTO = {
    label: params.label,
    timestamp: params.timestamp || '',
    timestamp: params.timestamp === 'true' ? true : false,
    name: 'hotquery',
  };

  const gatewayResp = await model.hotquery(hotqueryDTO);
  if (gatewayResp.searchResult.body.hits.hits.length === 0) {
    const labelResp = await model.labelCheck(hotqueryDTO);
    if (labelResp.searchResult.body.hits.hits.length > 0) {
      if (hotqueryDTO.timestamp) {
        return { items: [] };
      } else {
        return [];
      }
    } else {
      throw new BadRequestError('The label does not exist.');
    }
  } else {
    const hotqueryArr = JSON.parse(
      gatewayResp.searchResult.body.hits.hits[0]._source.hotqueryJSON
    );
    if (hotqueryDTO.timestamp) {
      return {
        timestamp: gatewayResp.searchResult.hits.hits[0]._source.timestamp,
        items: hotqueryArr,
      };
    } else {
      return hotqueryArr;
    }
  }
};

export const getRecommend = async (params) => {
  const recommendDTO = {
    keyword: params.keyword,
    label: params.label,
    name: 'recommend',
  };

  const gatewayResp = await model.recommend(recommendDTO);
  if (gatewayResp.searchResult.body.hits.hits.length === 0) {
    const labelResp = await model.labelCheck(recommendDTO);
    if (labelResp.searchResult.body.hits.hits.length > 0) {
      return [];
    } else {
      throw new BadRequestError('The label does not exist.');
    }
  } else {
    let recommend = gatewayResp.searchResult.body.hits.hits[0]._source.recommend;
    recommend = recommend.map((e) => e.trim()).filter((e) => e.length > 0);

    return recommend;
  }
};

export const getRelated = async (params) => {
  const relatedDTO = {
    keyword: params.keyword,
    label: params.label,
    name: 'related',
  };

  const gatewayResp = await model.related(relatedDTO);
  if (gatewayResp.searchResult.body.hits.hits.length === 0) {
    const labelResp = await model.labelCheck(relatedDTO);
    if (labelResp.searchResult.body.hits.hits.length > 0) {
      return [];
    } else {
      throw new BadRequestError('The label does not exist.');
    }
  } else {
    let related = gatewayResp.searchResult.body.hits.hits[0]._source.related;
    related = related.map((e) => e.trim()).filter((e) => e.length > 0);

    return related;
  }
};

export const getAutocomplete = async (params) => {
  const autocompleteDTO = {
    keyword: params.keyword,
    label: params.label,
    middle: params.middle === 'true' ? true : false,
    reverse: params.reverse === 'true' ? true : false,
    size: params.size ?? 10,
    sort: params.sort,
    name: 'autocomplete',
  };

  let autocompleteArr = [];
  let gatewayResp = await model.autocomplete(autocompleteDTO);
  if (gatewayResp.searchResult.body.hits.hits.length === 0) {
    const labelResp = await model.labelCheck(autocompleteDTO);
    if (labelResp.searchResult.body.hits.hits.length > 0) {
      return [];
    } else {
      throw new BadRequestError('The label does not exist.');
    }
  } else {
    gatewayResp.searchResult.body.hits.hits.forEach(async (hit) => {
      let item = {
        keyword: hit._source.keyword,
        highlight: hit._source.keyword,
        weight: hit._source.weight,
        custom: JSON.parse(hit._source.custom),
      };
      if (hit.highlight) {
        item.highlight = await autocomplete.highlightReplace(
          item.keyword,
          gatewayResp.keywordFields,
          hit.highlight
        );
      }
      autocompleteArr.push(item);
    });
  }
  return autocompleteArr;
};

export const getTheme = async (params) => {
  const themeDTO = {
    keyword: params.keyword,
    label: params.label,
    name: 'theme',
  };

  const gatewayResp = await model.theme(themeDTO);
  if (gatewayResp.searchResult.body.hits.hits.length === 0) {
    gatewayResp = await model.labelCheck(themeDTO);
    if (gatewayResp.searchResult.body.hits.hits.length > 0) {
      return [];
    } else {
      throw new BadRequestError('The label does not exist.');
    }
  } else {
    let item = gatewayResp.searchResult.body.hits.hits[0]._source;
    let images = {};
    let no = 1;
    item.images.forEach((ele) => {
      images['img' + no] = ele;
      no++;
    });

    let theme = _string_placeholder(item.contents, images);
    return theme;
  }
};

export const getSpeller = async (params) => {
  const spellerDTO = {
    query: params.query,
    label: params.label,
    eng2kor: params.eng2kor,
    distance: params.distance > 1 ? 2 : 1,
    overflow: params.overflow || 'true'
  };
  let correction = '';
  const arr = spellerDTO.query.split(/[ \t]/);
  for (let i = 0; i < arr.length; i++) {
    let results = speller.correct(spellerDTO.label, arr[i], spellerDTO.eng2kor, spellerDTO.distance, spellerDTO.overflow);
    if (results === false) {
      throw new BadRequestError('The label does not exist.');
    }
    if (correction.length > 0) {
      correction += ' ';
    }
    correction += results.length > 0 ? results[0].value.word : arr[i];
  }

  return {
    correction: correction
  }
}