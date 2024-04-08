export const indexConfig = () => ({
  search: {
    index: "kms_feedback",
    field: {
      search: [
        // 키워드 (0)
        "cntnt_keyword_k",
        // 제목 + 목차 (1:2)
        "cntnt_title_ksk.kobrick^70",
        "item_nm_ksk.kobrick^10",
        // 내용 (3)
        "cntnt_text_ksk.kobrick^50",
        // 파일 (4)   
        "file.file_content_ksk.kobrick"
      ],
      highlight: ["cntnt_title_ksk", "cntnt_text_ksk"], // 제목, 내용
      result: [
        "cntnt_no_k",
        "cntnt_title_ksk",
        "reg_dt",
        "weight_i",
        "item_nm_ksk",
        "cntnt_text_ksk",
        "dep_ctgr_k",
        "org_cd_k",
        "cntnt_count_i",
        "cntnt_good_i",
        "cntnt_keyword_k",
        "ctgr_nm_k",
        "item_seq_k"
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
        },
      },
      _source: [],
    }
  },
  autocomplate: {
    index: "kms_auto",
    field: {
      // 첫 단어 일치
      search_s: [
        "search_wd_kskn.autocomplete", 
        // "srch_wd.prefix^10"
      ],
      // 끝 단어 일치
      search_e: [
        "search_wd_kskn.autocomplete_reverse", 
        // "srch_wd.autocomplete"
      ],
      // 중간 단어 일치
      search_c: [
        "search_wd_kskn.autocomplete_middle", 
        // "srch_wd.autocomplete"
      ],
      // 단어 기반 일치
      search_t: [
        // "search_wd_kskn.keyword",
        "search_wd_kskn.kobrick",
        // "srch_wd.autocomplete"
      ],
      highlight: ["search_wd_kskn"],
      result: [
        "search_wd_kskn",
      ],
    },
    body: {
      size: 0,
      query: {
        bool: {
          must: [],
          filter: [],
          should: [],
          must_not: []
        },
      },
      // highlight: {
      //   pre_tags: "¶HS¶",
      //   post_tags: "¶HE¶",
      //   fields: {},
      // },
      _source: [],
    },
    aggs: {
      aggs: {
        terms: {
          field: "search_wd_kskn.keyword"
        }
      }
    }
  },
})

export const filterConfig = (label, params) => {
  const  filterQuery = [];

  if (label === "search") {
    // USE_YN
    filterQuery.push({
      term: {
        use_yn_k: "Y"
      }
    })

    // 카테고리 코드
    if (params.category && params.category.length > 0) {
      filterQuery.push({
        terms: {
          dep_ctgr_k: params.category
        }
      })
    }

    // 등록일 범위 (시작)
    if (params.start_dt) { // YYYYMMDDhhmmss 형식
      filterQuery.push({
        range: {
          reg_dt: {
            gte: params.start_dt,
            format: "yyyyMMdd||yyyy/MM/dd||yyyy-MM-dd||yyyyMMddHHmmss||yyyy-MM-dd HH:mm:ss"
          }
        }
      })
    }
    
    // 등록일 범위 (종료)
    if (params.end_dt) { // YYYYMMDDhhmmss 형식
      filterQuery.push({
        range: {
          reg_dt: {
            lte: params.end_dt,
            format: "yyyyMMdd||yyyy/MM/dd||yyyy-MM-dd||yyyyMMddHHmmss||yyyy-MM-dd HH:mm:ss"
          }
        }
      })
    }

    // 조직 코드
    if (params.org_cd) { // 일단 1개 받아올 경우로 짬. 여러개 받는 경우 terms 사용
      filterQuery.push({
        term: {
          org_cd_k: params.org_cd
        }
      })
    }
  }

  // } else if (label === "autocomplete") {
  //   // 도메인 번호 -> 형식 파라미터, 필터 조건 X
  //   if (params.domain_no) { // 일단 1개 받아올 경우로 짬. 여러개 받는 경우 terms 사용
  //     filterQuery.push({
  //       term: {
  //         reg_pgm_id_k: params.domain_no
  //       }
  //     })
  //   }
  // } else if (label === "keyword") {
  //   // 지부 -> 형식 파라미터, 필터 조건 X
  //   if (params.bnch_cd) { // 일단 1개 받아올 경우로 짬. 여러개 받는 경우 terms 사용
  //     filterQuery.push({
  //       term: {
  //         reg_pgm_id_k: params.bnch_cd
  //       }
  //     })
  //   }
  // }

  return filterQuery;
}

export const sortConfig = (label, order_type) => {
  const  sortQuery = [];
  const mappingFields = {
    search: ["_score", "reg_dt", "cntnt_count_i", "cntnt_good_i", "weight_i"]
  }

  if (label === "search") {
    sortQuery.push({
      [`${mappingFields.search[Number(order_type) - 1]}`]: {
        order: "desc"
      }
    })
  } 

  return sortQuery;
}

export const resultConfig = (label, data) => {
  if (label == "search") {
    const item_ctt = data.highlight 
      ? data.highlight["cntnt_text_ksk.kobrick"]
      : data._source.cntnt_text_ksk.slice(0, 150);

    return {
      cntnt_no: data._source.cntnt_no_k ?? null,
      cntnt_title: data._source.cntnt_title_ksk ?? null,
      reg_dtm: data._source.reg_dt ? (data._source.reg_dt).replace(/(\-|\:| )/g, "") : null,
      weight: data._source.weight_i ?? null,
      item_nm: data._source.item_nm_ksk ?? null,
      item_ctt: item_ctt ? typeof(item_ctt) != "string" ? item_ctt[0] : item_ctt : null,
      dep_ctgr_cd: data._source.dep_ctgr_k ?? null,
      org_cd: data._source.org_cd_k ?? null,
      cntnt_count: data._source.cntnt_count_i ?? null,
      cntnt_good: data._source.cntnt_good_i ?? null,
      cntnt_srch_wd: data._source.cntnt_keyword_k ?? null,
      ctgr_nm: data._source.ctgr_nm_k ?? null,
      item_seq: data._source.item_seq_k ?? null
    }
  } else if (label == "autocomplete") {
    return {
      keyword: data.key,
    }
  }
}
