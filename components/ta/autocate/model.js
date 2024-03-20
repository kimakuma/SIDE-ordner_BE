import axios from 'axios';
import { Logger } from '../../../lib/logger/logger.js';

const logger = Logger(import.meta.url);

export async function query(params) {
  return new Promise((resolve, reject) => {
    const shouldQuery = [];
    const taField = '@ta-train-classify-big-keyword-weighted-nested';
    const index = 'v1-ta_data_doc-001';
    let pow = 0;

    let body = {
      query: {
        bool: {
          must: [],
        },
      },
      _source: ['call_cnsl_lcls_cd', 'call_cnsl_lcls', 'call_cnsl_mcls_cd', 'call_cnsl_mcls'],
      size: 25,
    };

    let similarity = [];
    axios
      .post(`http://100.200.100.152:17400/txt_to_kwd`, {
        text: params.text || '',
        analyzer: 'kobrick',
        wordvector: 'train-classify',
        in_text: true,
        size: 20,
        include: {
          vector: false,
        },
      })
      .then(response => {
        similarity = response.data.results.results;

        if (similarity.length > 0) {
          similarity.map(data => {
            const query = {
              script_score: {
                query: {
                  term: {},
                },
                script: {
                  source: `doc['${taField}.weight'].value * params.weight`,
                  lang: 'painless',
                  params: {
                    weight: data.score,
                  },
                },
              },
            };

            query.script_score.query.term[`${taField}.keyword`] = {};
            query.script_score.query.term[`${taField}.keyword`].value = data.keyword;

            shouldQuery.push(query);

            pow += data.score * data.score;
          });

          body.query.bool.must.push({
            nested: {
              path: taField,
              score_mode: 'sum',
              query: {
                bool: {
                  should: shouldQuery,
                },
              },
            },
          });

          const SQRT_A_POW = Math.sqrt(pow);
          body.sort = [
            {
              _script: {
                script: {
                  source: `return _score / (params.SQRT_A_POW * Math.sqrt(doc['${taField.replace(
                    '-nested',
                    '',
                  )}-norm'].value))`,
                  lang: 'painless',
                  params: {
                    SQRT_A_POW,
                  },
                },
                type: 'number',
                order: 'desc',
              },
            },
            {
              _score: {
                order: 'desc',
              },
            },
          ];
        }
        let result = {
          index,
          body,
        };
        resolve(result);
      })
      .catch(err => {
        logger.error(err);
        logger.error('TA Run Error');
      });
  });
}
