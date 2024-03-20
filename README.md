# 변경사항
v1.0.4 (2023.08.03)
- speller 오류로 인한 메모리 누수 및 응답 지연 오류 수정
- es lint 설정 추가
- logger 인스턴스 캐싱하도록 수정

v1.0.2 (2023.04.10)
- msearch 샘플 추가
- windows 에서 실행 시 발생하는 swagger autogen 오류 수정
- pm2 watch 설정(코드 수정시 자동 재실행 / local 만 true)
- local 실행 명령 및 config 추가 (local(myhost), development, production)
  - 실행 방법은 package.json 파일 참조

1. **소스 구조 변경**
- 3-layer (Web layer, Service layer, Data access layer) 구조에 따른 소스 구조 수정 및 역할 변경.
- 각 레이어의 역할에 맞게 구조 변경
- component 기반 구조로 변경

[GitHub - goldbergyoni/nodebestpractices: The Node.js best practices list (November 2022)](https://github.com/goldbergyoni/nodebestpractices#-12-layer-your-components-keep-the-web-layer-within-its-boundaries)

[How to structure an Express.js REST API - best practices](https://blog.treblle.com/egergr/)
ㅂ
폴더 구조

```jsx

├─server.js                   // 서버 실행    
├─components                  // 개별 컴포넌트
│  │
│  ├─app.js                   // 애플리케이션 실행
│  └─search                   // 검색 API
│  │  ├─config
│  │  │   ├─index-config.js   // index 정보(쿼리, 필드 등...)
│  │  │   └─request-schema.js // API 요청 파라미터 유효성 확인 관련 설정
│  │  │
│  │  ├─index.js              // 라우터
│  │  ├─search-controller.js  // 요청 및 응답 처리
│  │  ├─search-service.js     // 모델에서 전달받은 데이터 가공 / 응답 생성
│  │  ├─search-model.js       // 쿼리 생성 / 데이터 조회
│  │  └─util
│  │
│  └─gateway                  // 게이트웨이 API
│  └─...                      // 기타 컴포넌트(TA, NLU 등...)
│ 
├─log                         // log 저장 폴더
│ 
├─lib                         // 공통 라이브러리
│  ├─elasticsearch            // ES 클라이언트 관리
│  ├─errors                   // 커스텀 에러 관련
│  │  ├─bad-request-error.js
│  │  ├─not-found-error.js
│  │  ├─ ...
│  │
│  ├─middleware               // Express 미들웨어
│  │  ├─async-wrapper.js      // Express 비동기 에러처리 간소화
│  │  ├─error-handler.js      // 에러 처리 미들웨어
│  │  └─validate.js           // 요청 파라미터 유효성 검사
│  └─util
├─config                      // API 설정
└─swagger                     // swagger 설정

```

2. **npm 모듈 변경**

불필요한 모듈 제거 및 deprecated 된 모듈 대체

일반적으로 많이 사용하는 모듈로 변경 및 신규 모듈 사용

- Elasticsearch
    
    [Introduction | Elasticsearch JavaScript Client [7.16] | Elastic](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.16/introduction.html)
    
- request-promise, async-request → axios
    
    [npm: axios](https://www.npmjs.com/package/axios)
    
- yup(validating)
    
    [npm: yup](https://www.npmjs.com/package/yup?activeTab=readme)
    
- config
    
    [npm: config](https://www.npmjs.com/package/config)
    
- 기타 불필요 모듈 제거

3. **요청 파라미터 유효성 검사(validating)**

yup 모듈 사용하여 유효성 검사 방식 통일 및 각 컴포넌트의 config 에서 해당 내용 관리

```jsx
// components/search/config/request-schema.js
import * as yup from 'yup';

export const sample = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    size: yup.number().positive().integer().default(1),
  })
}
```

4. **에러 처리**
- Error handler 미들웨어를 통한 에러 일괄 처리, 기존 Error handler 수정
- 커스텀 에러 객체를 통한 에러 처리 및 에러 응답 포맷 통일

5. **로깅**
- 로그 레벨 및 방법 정리. 로그 관리 추가 (log rotate)
- pm2 로그 사용 X(NODE_ENV === production 일 때)

6. **swagger**
- auto generator를 통한 swagger 설정 파일 자동 생성

7. gateway
- openquery gateway 기능을 API 에 추가(동일한 인터페이스)

# 개발 가이드

## 1. 설정 및 실행

설정은 config 모듈을 사용하여 관리

- NODE_ENV 환경변수에 따른(local, development, production) 설정파일 사용
- NODE_ENV 환경변수는 test, development, production 이외의 값은 사용하지 않도록 함
- 추가 설정파일이 필요한 경우(ex: local 등) NODE_CONFIG_ENV 환경변수를 사용
- NODE_CONFIG_ENV 는 NODE_ENV를 오버라이드하여 NODE_CONFIG_ENV 설정된 환경변수의 config를 읽음

[npm: config](https://www.npmjs.com/package/config)

```jsx
│─config                     
│  ├─default.json            // 기본 설정 파일
│  ├─myhost.json             // NODE_CONFIG_ENV = mylocal 일 경우 설정 파일
│  ├─development.json        // NODE_ENV = development 일 경우 설정 파일
│  ├─production.json         // NODE_ENV = production 일 경우 설정 파일

NODE_CONFIG_ENV 환경변수에서 local이라는 값은 config 모듈에서 사용하지 않도록 권장하여 myhost 사용

production 실행 시 default.json에 있는 설정값이 production.json에 없으면 dafault.json 값을 사용
```

설정파일 구조

```jsx
{
  "app": {
    "host": "http://127.0.0.1",
    "port": 14050,
    "https" : {
      "key": "/path/to/key",
      "cert": "/path/to/crt"
    },
    "swagger":{
      "host": "http://192.168.0.21:14050"
    },
    "logger":{
      "path":"",
      "error":{
        "maxFiles": 90,
        "maxSize": "100m"
      },
      "info":{
        "maxFiles": 30,
        "maxSize": "100m"
      },
      "debug":{
        "maxFiles": 1,
        "maxSize": "500m"
      }
    }
  },
  "elasticsearch": {
    "nodes": [
      "http://192.168.0.4:9203",
      "http://192.168.0.5:9203",
      "http://192.168.0.11:9203"
    ]
  }
}
```

설정파일 사용

```jsx
import config from 'config';
const port = config.get('app.port');

...
```

실행

```jsx
npm run dev   // NODE_ENV = development
npm run prod  // NODE_ENV = production

========================================================================

// package.json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "prelocal": "npm run swagger-autogen", // local 전 실행됨
    "predev": "npm run swagger-autogen",   // dev 실행 전 실행됨
    "preprod": "npm run swagger-autogen",  // prod 실행 전 실행됨
    "local": "pm2 start ecosystem.config.cjs --env local",
    "dev": "pm2 start ecosystem.config.cjs --env development",
    "prod": "pm2 start ecosystem.config.cjs --env production",
    "swagger-autogen": "node ./swagger/swagger-auto.js"
  },
```

pm2 설정파일(ecosystem.config.cjs)를 통해 NODE_ENV 환경변수를 설정

```
// ecosystem.config.cjs
module.exports = {
  apps : [{
    name: 'api-template',
    script: 'server.js',
    instances: 1,
    instance_var: 'api-template',
    env:{
      NODE_ENV: "local",
      watch: true
    },
    env_development: {
      NODE_ENV: "development",
      watch: true
   },
    env_production: {
      NODE_ENV: "production",
      watch: false,
   },
    exp_backoff_restart_delay: 100
  }]
};

```

## 2. 요청 및 응답

각 소스별 역할은 다음과 같다.

```jsx
├─server.js                   // 서버 실행    
├─components                  // 개별 컴포넌트
│  │
│  ├─app.js                   // 애플리케이션 실행
│  └─search                   // 검색 API
│  │  ├─config
│  │  │   ├─index-config.js   // index 정보(쿼리, 필드 등...)
│  │  │   └─request-schema.js // API 요청 파라미터 유효성 확인 관련 설정
│  │  │
│  │  ├─index.js              // 라우터
│  │  ├─search-controller.js  // 요청 및 응답 처리
│  │  ├─search-service.js     // 데이터 가공 / 응답 생성
│  │  ├─search-model.js       // 쿼리 생성 / 데이터 조회
│  │  └─util

...
```

1. **index.js**
- 각 컴포넌트의 index.js 파일이 라우터 역할을 함
- 미들웨어를 통해 요청 파라미터 validation 처리

```jsx
import express from 'express';
import * as controller from './search-controller.js';
import { validate } from '../../lib/middleware/validate.js';
import * as schema from './config/request-schema.js';

export const router = express.Router();

router.get('/', validate(schema.simple), controller.simpleSearch);;

...
```

- vailidation 조건은 각 컴포넌트의 config/request-schema.js 에 작성
- req 객체의 query, body, params 에 대해 validate 가능

[npm: yup](https://www.npmjs.com/package/yup)

```jsx
// /components/search/config/request-schema.js

import * as yup from 'yup';

// req.query에 있는 파라미터를 확인하는 경우
export const simple1 = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    size: yup.number().positive().integer().default(10),
    from: yup.number().integer().min(0).default(0)
  })

// req.body에 있는 파라미터를 확인하는 경우
export const simple2 = {
  body: yup.object({
    keyword: yup.string().trim().required(),
    size: yup.number().positive().integer().default(10),
    from: yup.number().integer().min(0).default(0)
  })

// req.query와 req.body 둘 다 값이 존재하는 경우
export const simple3 = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    size: yup.number().positive().integer().default(10),
  }),
  body: yup.object({
    name: yup.string().trim(),
    age: yup.number().positive().integer(),
  })
}
```

- validate가 실패하는 경우(조건에 맞지 않는 경우) BadRequestError 발생

```jsx
// lib/middleware/validate.js

export const validate = (schema) => async (req, res, next) => {
  try {
    if(!schema){
      logger.error(`schema is undefined`);
      next(new InternalServiceError(''));
    }
    const validated = await yup.object(schema).validate({
      body: req.body,
      query: req.query,
      params: req.params
    });

    req.validated = validated;

    return next();
  } catch (err) {
    next(new BadRequestError(err.message));
  }
}
```

- validate시 trim(), default() 등을 사용하여 공백 제거나 디폴드 값을 설정하는 등의 요청 값을 변경하는 경우 컨트롤러에서 req.validated 프로퍼티를 통해 전달됨.

```jsx
// components/search/search-controller.js

export const singleSearch = asyncWrapper(async (req, res, next) => {
  const params = req.validated.query;
  const response = await searchService.single(params);
  
	...

}
```

1. **controller**
- 요청파라미터를 service에 전달하고 service로부터 리턴받은 결과를 통해 응답
- service에 req 객체를 직접 전달하지 않고 필요한 파라미터만 전달
- 컨트롤러 함수는 비동기 에러 처리때문에 발생하는 try/catch 와 next() 호출을 생략하기 위해 asyncWrapper 라는 wrapper 함수로 감싸 처리
- 에러 응답은 컨트롤러에서 보내지 않고 error handler에서 일괄 처리.
- swagger에 사용되는 API 정보 작성

```jsx
// components/search/search-controller.js

export const simpleSearch = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['stock']
  #swagger.summary = 'news, stock 키워드 검색'
  #swagger.description = '키워드로 news, stock 인덱스에 검색하는 API'
  #swagger.parameters['keyword'] = { 
    in: 'query',
    description: '키워드',
    required: true,
    type: 'string'
  }
  #swagger.parameters['size'] = { description: '개수' } 
  #swagger.parameters['from'] = { description: 'from' } 
  */

  const params = req.validated.query;
  const response = await searchService.simple(params);

  axios
    .post(`${appConfig.host}:${appConfig.port}/gateway/querylog`, {
      query: params.keyword,
      ...response.meta,
    })
    .then(() => {
      // logger.debug('querylog success');
    })
    .catch((err) => {
      logger.error(err);
      logger.error('querylog failed');
    });

  res.send(response);
}
```

1. **service**
- 컨트롤러에서 전달받은 파라미터를 model에 전달하여 데이터를 받음
- model로부터 받은 데이터를 가공하고 API 응답 생성

```jsx
// /components/search/search-service.js

export const simple = async (params) => {
  const simpleDTO = params;
  const { searchResult, index } = await searchModel.simple(simpleDTO);

  const body = searchResult.body.hits.hits.map(item => {
    return {
      ...item._source,
      highlight: item.highlight
    }
  })

  const response = {
    meta: {
      index,
      took: searchResult.body.took,
      total: searchResult.body.hits.total.value
    },
    body
  }
  logger.info(JSON.stringify(response.meta))
  return response;
}
```

1. **model**
- service로 부터 전달받은 파라미터를 통해 쿼리 생성 및 데이터 조회
- 조회에 필요한 index, 필드, 쿼리 등에 대한 정보는 config/index-config.js 파일에 작성

```jsx
// /components/search/config/index-config.js

export const simple = () => {
  return {
    index: ['news', 'stock'],
    field: {
      search: ['title', 'content'],
      highlight: ['reporter', 'title', 'content'],
      result:['title']
    },
    body: {
      from: 0,
      size: 0,
      query: {
        bool: {
          must: [],
          filter: [],
          should: []
        }
      },
      highlight:{
        fields:{}
      },
      _source: []
    }
  }
}
```

```jsx
// /components/search/search-model.js

export const simple = async (params) => {
  try {
    const simpleConfig = indexConfig.simple();
    const index = simpleConfig.index.join(',');
    const field = simpleConfig.field;
    const body = simpleConfig.body;

		// 쿼리 생성
    body.query.bool.must.push({
      multi_match: {
        fields: simpleConfig.field.search,
        query: params.keyword
      }
    });

    field.highlight.forEach(item => {
      body.highlight.fields[item] = {};
    })

    body._source = field.result;
    body.size = params.size;
    body.from = params.from;

    logger.debug(JSON.stringify({
      index,
      body
    }))

		// 데이터 조회
    const searchResult = await search({
      index,
      body
    });

    return { searchResult, index };
  } catch (err) {
    throw err;
  }
}
```

요청 및 응답 처리 과정에서 필요한 유틸리티는 각 컴포넌트의 util 폴더에 작성

## 3. 에러 처리

- API 요청 처리 중 발생하는 에러는 기본적으로 throw 하여 Error Handler로 전달
- Error Handler에서 에러 로깅 및 에러 응답 생성하여 전달.

```jsx
// /lib/middleware/error-handler.js

export const errorHandler = async (err, req, res, next) => {
  if(!res){
    logger.error('Undefined req object');
    process.exit(1);
  }
  const reqUrl = decodeURI(req.url);
  const reqBody = JSON.stringify(req.body);

  logger.error(`${reqUrl}\nreq.body: ${reqBody}\n${err.stack}`);

  if(err instanceof CustomError){
    const status = err.status ? err.status : 500;
    return res.status(status).json(err);
  }

  const internalServiceError = new InternalServiceError('Internal Service Error');
  return res.status(500).json(internalServiceError);
}
```

- CustomError 클래스를 통해 에러 구분
    - Not Found, Bad Request 등
    - 에러 응답은 HTTP 상태 코드에 따라 작성
        - [https://developer.mozilla.org/ko/docs/Web/HTTP/Status](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)
        - ex) Elasticsearch 조회 실패 시 Bad Gateway Error
    - 정의된 에러 이외에 추가로 필요할 경우 HTTP 상태 코드에 맞게 추가하여 사용
    - CustomError가 아닌 나머지 에러는 InternalServiceError로 응답

예시

```jsx
// /lib/errors/bad-gateway-error.js
 
import { CustomError } from "./custom-error.js";

export class BadGatewayError extends CustomError {
  constructor(data){
    super(502, 'Bad Gateway Error', data);
  }
}

===================================================================

// /lib/elasticsearch/client.js

const handleError = (err) => {
  logger.error(`${err.name}: ${err.message}`);
  if(err instanceof esErrors.ResponseError){
    logger.error(JSON.stringify(err.meta.body.error.caused_by));
  }
  throw new BadGatewayError();
}

export const search = async (params) => {
  try{
    const result = await client.search(params);
    return result;
  } catch (err) {
    handleError(err);
  }
}
```

API 에러 응답의 구조는 모두 아래와 같은 동일한 구조를 가짐

```jsx
{
  "status": 502,
  "message": "Bad Gateway Error",
  "data": ""
}
```

## 4. 로깅

- winston, morgan 사용(경로 : /lib/logger/logger.js, morgan.js)
- 로그 레벨은 error, info, debug 3가지 사용
- 로그 관리(log rotate) 설정
- 운영환경(NODE_ENV === production) 시 pm2 로그 적재하지 않음

```jsx
// /config/default.json
{
  "app": {
  // 로그 설정 부분 
    "logger":{
      "path":"", // 로그 파일 저장 경로. 없으면 ${API_HOME}/logs에 쌓음
      "error":{ // error 로그 설정 
        "maxFiles": 90, // 최대 파일 개수(일자와 다름. 파일 개수)
        "maxSize": "100m" // 파일 최대 크기
      },
      "info":{ // 일반적인 info 로그
        "maxFiles": 30,
        "maxSize": "100m"
      },
      "debug":{ // debug 로그. 운영시 쿼리 보기 위한 용도
        "maxFiles": 1,
        "maxSize": "100m"
      }
    }
  }
}
```

사용 방법

```jsx
import { Logger } from '../lib/logger/logger.js';
const logger = Logger(import.meta.url);  // 로그를 출력하는 파일 경로를 얻기 위해
```

로그 예시

```jsx
2023-03-17 09:11:07:117 [error] /lib/elasticsearch/client.js: ResponseError: parsing_exception
2023-03-17 09:11:07:117 [error] /lib/middleware/error-handler.js: /search/?keyword=주식
req.body: {}
Error: Bad Gateway Error
    at handleError (file:///Users/yonguk/dev/search_api/lib/elasticsearch/client.js:35:9)
    at search (file:///Users/yonguk/dev/search_api/lib/elasticsearch/client.js:43:5)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async Module.simple (file:///Users/yonguk/dev/search_api/components/search/search-model.js:33:26)
    at async Module.simple (file:///Users/yonguk/dev/search_api/components/search/search-service.js:7:35)
    at async file:///Users/yonguk/dev/search_api/components/search/search-controller.js:24:20
    at async file:///Users/yonguk/dev/search_api/lib/middleware/async-wrapper.js:4:4
2023-03-17 09:11:07:117 [info] /lib/logger/morgan.js: GET /search/?keyword=%EC%A3%BC%EC%8B%9D 502
```

## 5. Swagger

swagger-autogen 모듈로 swagger 설정 파일 자동 생성

```jsx
// /swagger/swagger-auto.js
import swaggerAutogen from 'swagger-autogen';

const doc = { // 문서 설정
  info: {
    title: "API Template",
    description: "API Template Description",
  },
  host: "192.168.0.21:14050",
  schemes: ["http"], 
};

const outputFile = "./swagger-output.json"; // swagger 최종 output 파일
const endpointsFiles = [
  "./components/app.js" // route 읽는 경로. ,구분자로 다른 route 추가 가능
];

swaggerAutogen()(outputFile, endpointsFiles, doc);
```

사용방법

1. controller 파일에 주석을 통해 API 정보(파라미터 등) 작성

```jsx
// /components/search/search-controller.js

export const simpleSearch = asyncWrapper(async (req, res, next) => {
  /* 
  #swagger.tags = ['stock']
  #swagger.summary = 'news, stock 키워드 검색'
  #swagger.description = '키워드로 news, stock 인덱스에 검색하는 API'
  #swagger.parameters['keyword'] = { 
    in: 'query',
    description: '키워드',
    required: true,
    type: 'string'
  }
  #swagger.parameters['size'] = { description: '개수' } 
  #swagger.parameters['from'] = { description: 'from' } 
  */
  const params = req.validated.query;
  const response = await searchService.simple(params);

   ... 
})
```

1. API 실행

```jsx
npm run local
또는
npm run dev
또는
npm run prod

명령에 따라 다른 config 파일을 로딩하여 실행됨

실행 시 pre 커맨드를 통해 자동으로 npm run swagger-autogen 실행됨
```

```jsx
// package.json 
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "prelocal": "npm run swagger-autogen",
    "predev": "npm run swagger-autogen",
    "preprod": "npm run swagger-autogen",
    "local": "pm2 start ecosystem.config.cjs --env local",
    "dev": "pm2 start ecosystem.config.cjs --env development",
    "prod": "pm2 start ecosystem.config.cjs --env production",
    "swagger-autogen": "node ./swagger/swagger-auto.js"
  },
```

## 6. gateway

기존 Openquery Gateway를 동일한 기능과 인터페이스로 API에 포함하여 openqury gateway 실행 없이 기능 사용 가능하도록 함.

```jsx
// /components/gateway/index.js

//쿼리 로그 적재
router.post('/querylog', validate(schema.querylogParams), controller.querylog);
//인기 검색어
router.get('/popquery', validate(schema.popquery), controller.popquery);
//급상승 검색어
router.get('/hotquery', validate(schema.hotquery), controller.hotquery);
//추천 검색어
router.get('/recommend', validate(schema.recommend), controller.recommend);
//연관 검색어
router.get('/related', validate(schema.related), controller.related);
//자동완성
router.get('/autocomplete', validate(schema.autocomplete), controller.autocomplete);
//검색어 테마
router.get('/theme', validate(schema.theme), controller.theme);
//오타교정
router.get('/speller', validate(schema.speller), controller.speller);
```

## 7. Elasticsearch Client

[Introduction | Elasticsearch JavaScript Client [7.16] | Elastic](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.16/introduction.html)

에러 처리 문제로 Elasticsearch client 모듈을 wrapping해서 사용

```jsx
// /lib/elasticsearch/client.js

import { Client } from '@elastic/elasticsearch';

export const search = async (params) => {
  try{
    const result = await client.search(params);
    return result;
  } catch (err) {
    handleError(err);
  }
}

export const msearch = async (params) => {
  try{
    const result = await client.msearch(params);
    return result;
  } catch (err) {
    handleError(err);
  }
}
```

Es Client API의 모든 리턴 값은 아래의 구조를 가짐

```jsx
{
  body: object | boolean
  statusCode: number
  headers: object
  warnings: [string]
  meta: object
}
```

사용 예시

```jsx
// Let's search!
  const { body } = await client.search({
    index: 'game-of-thrones',
    // type: '_doc', // uncomment this line if you are using {es} ≤ 6
    body: {
      query: {
        match: { quote: 'winter' }
      }
    }
  })

  console.log(body.hits.hits)
```

## 8. 기타
Node.js v16.14.0 으로 개발
회사 개발서버에 레퍼런스 구축 예정