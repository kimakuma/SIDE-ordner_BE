export const indexConfig = () => ({
  keyword: {
    index: "assist_kms_data",
    field: {
      // 전체
      search: [
        "cntnt_title_ksk.*",   // 제목
        "item_nm_ksk.*",       // 목차
        "cntnt_text_ksk.*",    // 내용
        "file_content_ksk.*",  // 파일
        "cntnt_keyword_k",      // 키워드
      ],
      highlight: ['reporter', 'title', 'content'], // 아직 필드 안정함
      result: [
        "cntnt_no_k",
        "cntnt_title_ksk",
        "reg_dt",
        "cntnt_text_ksk",
        "dep_ctgr_k",
        "org_cd_k",
        "cntnt_count_i",
        "cntnt_good_i",
        "cntnt_keyword_k",
        "ctgr_nm_k"
      ],
    },
    body: {
      from: 0,
      size: 0,
      query: {
        bool: {
          must: [],
          filter: [],
          should: [],
          must_not: []
        },
      },
      highlight: {
        number_of_fragments: 1,
        fragment_size: 150,
        pre_tags: "<em>",
        post_tags: "</em>",
        fields: {
          "cntnt_text_ksk.kobrick": {},
          "cntnt_text_ksk.standard": {},
        },
      },
      _source: [],
    }
  }
})

export const filterConfig = (label, params) => {
  const  filterQuery = [];

  if (label === "keyword") {
    // USE_YN
    filterQuery.push({
      term: {
        use_yn_k: "Y"
      }
    })
  }
  return filterQuery;
}

export const resultConfig = (label, data) => {
  if (label == "keyword") {
    const item_ctt = data.highlight 
      ? ( data.highlight["cntnt_text_ksk.kobrick"]
      ??  data.highlight["cntnt_text_ksk.standard"] )
      : data._source.cntnt_text_kskn.slice(0, 150);

    return {
      cntnt_no: data._source.cntnt_no_k,
      cntnt_title: data._source.cntnt_title_ksk,
      reg_dtm: data._source.reg_dt,
      item_ctt: typeof(item_ctt) != "string" ? item_ctt[0] : item_ctt,
      dep_ctgr_cd: data._source.dep_ctgr_k,
      org_cd: data._source.org_cd_k,
      cntnt_count: data._source.cntnt_count_i,
      cntnt_good: data._source.cntnt_good_i,
      cntnt_srch_wd: data._source.cntnt_keyword_k,
      ctgr_nm: data._source.ctgr_nm_k, 
    }
  }
}
