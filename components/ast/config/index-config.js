export const indexConfig = () => ({
  keyword: {
    index: "kms_feedback",
    field: {
      // 전체
      search: [
        "cntnt_title_ksk.kobrick^40",  "cntnt_title_ksk.standard^40",  "cntnt_title_ksk.keyword^40",        // 제목
        "item_nm_ksk.kobrick^10", "item_nm_ksk.standard", "item_nm_ksk.keyword",                            // 목차
        "cntnt_text_ksk.kobrick^15", "cntnt_text_ksk.standard",  "cntnt_text_ksk.keyword",                  // 내용
        "file.file_content_ksk.kobrick", "file.file_content_ksk.standard", "file.file_content_ksk.keyword", // 파일
        "cntnt_keyword_k",                                                                                  // 키워드
      ],
      highlight: ['cntnt_text_ksk'],
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
        "ctgr_nm_k",
        "item_seq_k",
        "POSITIVE_kwd", 
        "NEGATIVE_kwd"
      ],
    },
    body: {
      from: 0,
      size: 0,
      query: {
        bool: {
          must: [],
          filter: [],
          should: [
            {
              nested: {
                path: "POSITIVE_kwd",
                query: {
                  bool: {
                    should: []
                  }
                },
                score_mode: "sum"
              }
            }
          ],
          must_not: [
            {
              nested: {
                path: "NEGATIVE_kwd",
                query: {
                  bool: {
                    should: []
                  }
                }
              }
            }
          ]
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
      : data._source.cntnt_text_ksk.slice(0, 150);

    return {
      cntnt_no: data._source.cntnt_no_k ?? null,
      cntnt_title: data._source.cntnt_title_ksk ?? null,
      reg_dtm: data._source.reg_dt ?? null,
      item_ctt: typeof(item_ctt) != "string" ? item_ctt[0] : item_ctt,
      dep_ctgr_cd: data._source.dep_ctgr_k ?? null,
      org_cd: data._source.org_cd_k ?? null,
      cntnt_count: data._source.cntnt_count_i ?? null,
      cntnt_good: data._source.cntnt_good_i ?? null,
      cntnt_srch_wd: data._source.cntnt_keyword_k ?? null,
      ctgr_nm: data._source.ctgr_nm_k ?? null,
      item_seq: data._source.item_seq_k ?? null
    }
  }
}
