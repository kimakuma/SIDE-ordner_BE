import _moment from "moment";
import hangul from './hangul.js';
import EditDistance from './editdistance.js';
import { search, scroll } from '../../../lib/elasticsearch/client.js';
import { Logger } from '../../../lib/logger/logger.js';
const logger = Logger(import.meta.url);

let speller = {};

export const update = async () => {
  return new Promise(function (resolve, reject) {
    const index = '.openquery';
    let body = {
      size: 100,
      query: {
        exists: {
          field: 'speller',
        },
      },
    };

    search({ index, body }).then((resp) => {
      if (resp.body.hits.hits.length === 0) {
        resolve();
      } else {
        resp.body.hits.hits.forEach((ele) => {
        let label = ele._source.speller.label;
   
        
        if (!speller.hasOwnProperty(label)) {
          speller[label] = {
            ed: new EditDistance(),
            typo: {},
            timestamp: 0,
            total: 0,
          };
        }
        
        setTimeout(checkTimestamp, 1, resolve, reject, label);
        });
        resolve();
        }
      },(err) => {
        reject(err);
      });
    
    function checkTimestamp(resolve, reject, label) {
      const index = '.openquery-speller';
      let body = {
        size: 1,
        query: {
          match: {
            label: label,
          },
        },
        sort: [
          {
            timestamp: {
              order: 'desc',
            },
          },
        ],
      };

      search({ index, body }).then((resp) => {
        let total = resp.body.hits.total.value;
        if (total > 0) {
          const hit = resp.body.hits.hits[0]._source;
          let timestamp = _moment(hit.timestamp);

          if (
            speller[label].timestamp === 0 ||
            speller[label].timestamp < timestamp.valueOf() ||
            speller[label].total != total
          ) {
            logger.info("loading speller ...");

            setTimeout(load, 1, resolve, reject, undefined, label, {
              ed: new EditDistance(),
              typo: {},
              timestamp: timestamp.valueOf(),
              total: total,
            });
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      },(err) => {
        reject(err);
      });
    }

    function load(resolve, reject, scrollid, label, newinstance) {
      const esMode = 'service';
      const index = '.openquery-speller';
      const scrollTime = '30s';

      if (scrollid === undefined) {
        let body = {
          size: 1000,
          query: {
            match: {
              label: label,
            },
          },
          sort: [
            {
              timestamp: {
                order: 'desc',
              },
            },
          ],
        };

        //   search(index, payload, scrollTime)
        search({ index, scroll: scrollTime, body }).then((resp) => {
          if (resp.body.hits.hits.length > 0) {
            setTimeout(insert, 1, resolve, reject, resp, label, newinstance);
          } else {
            setTimeout(done, 1, resolve, reject, label, newinstance);
          }
        })
        .catch(err => {
          logger.error(err);
          reject(err);
        })


      } else {
        scroll(esMode, scrollTime, scrollid).then((resp) => {
          if (resp.body.hits.hits.length > 0) {
            setTimeout(insert, 1, resolve, reject, resp, label, newinstance);
          } else {
            setTimeout(done, 1, resolve, reject, label, newinstance);
          }
        }, (err) => {
          reject(err);
        });
      }
    }

    function insert(resolve, reject, resp, label, newinstance) {
      resp.body.hits.hits.forEach(function (hit) {
        const jaso = hangul.decompose(hit._source.keyword).join('');
        newinstance.ed.insert(jaso, {
          word: hit._source.keyword,
          weight: hit._source.weight * 1,
        });

        const engjaso = hangul.jaso_to_english(jaso).join('');
        if (engjaso !== jaso) {
          newinstance.ed.insert(engjaso, {
            word: hit._source.keyword,
            weight: hit._source.weight * 1,
          });
        }

        hit._source.typo.forEach(function (typo) {
          newinstance.typo[typo] = {
            word: hit._source.keyword,
            weight: 0,
          };
        });
      });

      setTimeout(load, 1, resolve, reject, resp.body._scroll_id, label, newinstance);
    }

    function done(resolve, reject, label, newinstance) {
      speller[label].ed = newinstance.ed;
      speller[label].typo = newinstance.typo;
      speller[label].timestamp = newinstance.timestamp;
      speller[label].total = newinstance.total;

      logger.info("speller dictionary update completed");
      resolve();
    }
  });
};

export const correct = (label, word, eng2kor, distance, overflow) => {
  if (speller[label] === undefined) {
    return false;
  }

  let typo = speller[label].typo[word];
  if (speller[label].typo[word] !== undefined) {
    return [
      {
        cost: 0,
        value: typo,
      },
    ];
  }

  // edit-distance
  const jaso = hangul.decompose(word).join('');
  let results = speller[label].ed.lookup(jaso, distance);

  if (results.length > 0) {
    if (overflow === 'false') {
      results = results.filter((item) => word.length >= item.value.word.length);
    }

    // sort by cost and weight
    return results.sort((a, b) => {
      if (a.cost === b.cost) {
        return a.value.weight > b.value.weight
          ? -1
          : a.value.weight < b.value.weight
          ? 1
          : a.value.word > b.value.word
          ? 1
          : -1;
      } else {
        return a.cost > b.cost ? 1 : a.cost < b.cost ? -1 : 0;
      }
    });
  } else {
    // auto convert : english to hangul
    let autoconv;
    if (eng2kor === 'true') {
      autoconv = hangul.english_to_hangul(word).join('');
    } else {
      autoconv = word;
    }

    if (autoconv.length > 0 && autoconv !== word) {
      return [
        {
          cost: 0,
          value: {
            word: autoconv,
            weight: 0,
          },
        },
      ];
    }
  }
  return [];
};
