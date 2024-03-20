export const highlightReplace = async (value, fields, highlight) => {
  if (value.constructor === Array) {
    let ret = [];

    value.forEach((v) => {
      let every = fields.every((f) => {
        if (
          highlight[f] &&
          v === highlight[f][0].replace(/¶HS¶/g, '').replace(/¶HE¶/g, '')
        ) {
          ret.push(highlight[f][0]);
          return false;
        }
        return true;
      });
      if (every === true) {
        ret.push(v);
      }
    });

    return ret;
  } else {
    let ret = '';

    let every = fields.every((f) => {
      if (highlight[f]) {
        ret = highlight[f][0];
        return false;
      }
      return true;
    });

    return every === true ? value : ret;
  }
};
