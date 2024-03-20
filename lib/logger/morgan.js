import morgan from 'morgan'
import { Logger } from "./logger.js"

const logger = Logger(import.meta.url);

/**
 * 현재는 :method :url :status 만 찍음
 * 아래 설정으로 운영/개발 시 로그 변경 설정 가능
 */
// const format = () => {
//    const result = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
//    return result;
// };

// 로그 작성을 위한 Output stream옵션. // morgan 로그 기본 개행 제거
// const stream = {
//    write: (message) => {
//       logger.info(message.substring(0, message.lastIndexOf("\n")));
//    },
// };
// morgan 로그 개행 
const stream = {
  write: message => {
     logger.info(message);
  },
};

// 로깅 스킵 여부 (만일 배포환경이면, 코드가 400 미만라면 함수를 리턴해 버려서 로그 기록 안함. 코드가 400 이상이면 로그 기록함)
const skip = (_, res) => {
  //  if (process.env.NODE_ENV === 'production') {
  //     return res.ststusCode < 400;
  //  }
  if (res.req.url === '/querylog') {
    return true
  }
   return false;
};

// 적용될 moran 미들웨어 형태
const morganMiddleware = morgan(
    ':method :url :status', { stream,skip }
);

// format , skip 사용시 morgan 설정 방법
// const morganMiddleware = morgan(
//   format(),
//   , { stream, skip}
// );


export default morganMiddleware