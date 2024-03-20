import axios from 'axios';
import { Logger } from '../../../lib/logger/logger.js';
import { emotion } from '../config/request-schema.js';

const except_word = ['네', '예', '여보세요'];

export const emot = async params => {
  let emot_res_arr = new Map();
  emot_res_arr.set('강한부정', 0);
  emot_res_arr.set('부정', 0);
  emot_res_arr.set('긍정', 0);
  emot_res_arr.set('미분류', 0);
  //const simpleDTO = params;

  let data_arr = [];
  for (let i = 0; i < params.length; i++) {
    if (!except_word.includes(params[i].in.trim())) {
      data_arr.push(params[i].in.trim());
    }
  }

  for (let i = 0; i < data_arr.length; i++) {
    let emot = await nluAPI(data_arr[i]);
    if (emot.res[0].length > 0) {
      if (emot.res[0][0].intent == '강한부정') {
        if (emot.res[0][0].score < 1) continue;
      }
      emot_res_arr.set(emot.res[0][0].intent, emot_res_arr.get(emot.res[0][0].intent) + 1);
    } else {
      emot_res_arr.set('미분류', emot_res_arr.get('미분류') + 1);
    }
  }

  let positive = Math.ceil((emot_res_arr.get('긍정') / data_arr.length) * 100);

  let negative = Math.ceil(((emot_res_arr.get('부정') + emot_res_arr.get('강한부정')) / data_arr.length) * 100);

  let emotion_res = 0;
  if (negative >= 100) emotion_res = 5;
  else if (emot_res_arr.get('강한부정') > 0) emotion_res = 5;
  else if (positive == 0 && negative >= 30) emotion_res = 5;
  else if (positive == 0 && negative < 30 && negative > 0) emotion_res = 4;
  else if (emot_res_arr.get('긍정') > 1 && negative >= 30) emotion_res = 4;
  else if (positive >= 100) emotion_res = 1;
  else if (negative == 0 && emot_res_arr.get('긍정') >= 3) emotion_res = 1;
  else if (positive >= 50 && emot_res_arr.get('긍정') >= 3) emotion_res = 1;
  else if (negative == 0 && emot_res_arr.get('긍정') >= 1) emotion_res = 2;
  else if (positive < 50 && negative > 0 && positive > negative) emotion_res = 2;
  else emotion_res = 3;

  let result = {
    call_emot_k: emotion_res,
  };

  return result;
};

async function nluAPI(sentense) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://100.200.100.143:17500/match`, {
        params: {
          domainId: 'kahp',
          in: sentense,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  });
}
