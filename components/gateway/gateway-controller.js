import * as gatewayService from './gateway-service.js';
import { asyncWrapper } from '../../lib/middleware/async-wrapper.js';

export const querylog = asyncWrapper(async (req, res, next) => {
  /*
  #swagger.tags = ['gateway']
  #swagger.summary = 'querylog 적재'
  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Some description...',
    schema: {
      index: 'news',
      query: '주식',
      total: '10',
      took: '9'
    }
  } 
  */
  const params = req.body;
  const response = await gatewayService.setQuerylog(params);
  res.send(response);
})

export const popquery = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['gateway']
  #swagger.summary = '인기검색어'
  #swagger.description = '저장된 인기 검색의 레이블을 입력 시, 입력한 레이블의 현재 인기검색어를 제공하는 서비스'
  #swagger.parameters['label'] = { 
    in: 'query',
    description: 'label',
    required: true,
    type: 'string'
  }
  */
  const params = req.query;
  const response = await gatewayService.getPopquery(params);
  res.send(response);
})

export const hotquery = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['gateway']
  #swagger.summary = '급상승검색어'
  #swagger.description = '저장된 인기 검색어의 레이블을 입력 시, 입력한 레이블의 급상승검색어를 제공하는 서비스'
  #swagger.parameters['label'] = { 
    in: 'query',
    description: 'label',
    required: true,
    type: 'string'
  }
  */
  const params = req.query;
  const response = await gatewayService.getHotquery(params);
  res.send(response);
});

export const recommend = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['gateway']
  #swagger.summary = '추천검색어'
  #swagger.description = '사용자가 요청한 키워드에 대한 저장된 추천검색어를 제공하는 서비스'
  #swagger.parameters['label'] = { 
    in: 'query',
    description: 'label',
    required: true,
    type: 'string'
  }
  #swagger.parameters['keyword'] = { description: '키워드' } 
  */
  const params = req.query;
  const response = await gatewayService.getRecommend(params);
  res.send(response);
});

export const related = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['gateway']
  #swagger.summary = '연관검색어'
  #swagger.description = '사용자가 요청한 키워드에 대한 저장된 연관검색어를 제공 서비스'
  #swagger.parameters['label'] = { 
    in: 'query',
    description: 'label',
    required: true,
    type: 'string'
  }
  #swagger.parameters['keyword'] = { description: '키워드' } 
  */
  const params = req.query;
  const response = await gatewayService.getRelated(params);
  res.send(response);
});

export const autocomplete = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['gateway']
  #swagger.summary = '자동완성'
  #swagger.description = '사용자가 의도한 검색어의 일부만 입력해도 입력한 문자가 포함된 다양한 자동완성어를 추천하는 서비스'
  #swagger.parameters['label'] = { 
    in: 'query',
    description: 'label',
    required: true,
    type: 'string'
  }
  #swagger.parameters['keyword'] = { 
    in: 'query',
    description: 'keyword',
    required: true,
    type: 'string'
  }
  #swagger.parameters['middle'] = { description: '공백 기준으로 중간 검색 여부 (기본값: false)' } 
  #swagger.parameters['size'] = { description: '응답 결과의 최대 리스트 건수 (기본값: 10)' } 
  #swagger.parameters['sort'] = { description: '응답 결과에 대한 정렬 방식 (기본값: keyword)' } 
  */
  const params = req.query;
  const response = await gatewayService.getAutocomplete(params);
  res.send(response);
});

export const theme = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['gateway']
  #swagger.summary = '검색어테마'
  #swagger.description = '사용자가 요청한 테마의 키워드에 대해 이미지를 포함한 테마에 맞는 화면을 제공해주는 서비스'
  #swagger.parameters['label'] = { 
    in: 'query',
    description: 'label',
    required: true,
    type: 'string'
  }
  #swagger.parameters['keyword'] = { 
    in: 'query',
    description: 'keyword',
    required: true,
    type: 'string'
  }
  */
  const params = req.query;
  const response = await gatewayService.getTheme(params);
  res.send(response);
});

export const speller = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['gateway']
  #swagger.summary = '오타교정'
  #swagger.description = '교정이 필요한 키워드를 입력 시 교정된 키워드를 제공하는 서비스'
  #swagger.parameters['label'] = { 
    in: 'query',
    description: 'label',
    required: true,
    type: 'string'
  }
  #swagger.parameters['query'] = { 
    in: 'query',
    description: '교정 키워드',
    required: true,
    type: 'string'
  }
  #swagger.parameters['eng2kor'] = { description: '한/영 변환 사용 여부 (기본값: true)' } 
  */
  const params = req.query;
  const response = await gatewayService.getSpeller(params);
  res.send(response);
});

