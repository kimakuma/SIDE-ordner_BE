export const indexConfig = () => ({
  resultTA: {
    index: "stt_ta_data",
    field: {
      search: [],
      result: [
        "bnch_cd",
        "rec_id",
        "extension_num",
        "call_id",
        "call_imp_word",
        "call_cnsl_st",
        "call_cnsl_st_cd",
        "call_cnsl_nd",
        "call_cnsl_nd_cd",
        "call_cnsl_rd",
        "call_cnsl_rd_cd",
        "call_ori_cnts_ksk",        
        "call_emot_k"
      ],
    },
    body: {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [],
          filter: [],
          should: [],
          must_not: []
        },
      },
      _source: [],
    }
  },
})

export const resultConfig = (label, data) => {
  if (label == "resultTA") {
    return {
      bnch_cd: data._source.bnch_cd,
      rec_id: data._source.rec_id,
      extension_num: data._source.extension_num,
      call_id: data._source.call_id,
      call_imp_word: data._source.call_imp_word.join(","),
      call_cnsl_st: data._source.call_cnsl_st,
      call_cnsl_st_cd: data._source.call_cnsl_st_cd,
      call_cnsl_nd: data._source.call_cnsl_nd,
      call_cnsl_nd_cd: data._source.call_cnsl_nd_cd,
      call_cnsl_rd: data._source.call_cnsl_rd,
      call_cnsl_rd_cd: data._source.call_cnsl_rd_cd,
      call_ori_cnts: data._source.call_ori_cnts_ksk.join("\n"),
      coun_gubun1: data._source.call_emot_k,
    }
  }
}
