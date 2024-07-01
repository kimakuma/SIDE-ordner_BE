export const indexConfig = () => ({
  search: {
    index: "kms_feedback",
    field: {
      search: [
        // 키워드 (0)
        "cntnt_keyword_k",
        // 제목 + 목차 (1:2)
        "cntnt_title_ksk.kobrick^10",
        "item_nm_ksk.kobrick^1.5",
        // 내용 (3)
        "cntnt_text_ksk.kobrick^4",
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
})

export const filterConfig = (label, params) => {
  const filterQuery = [];

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

  return filterQuery;
}

export const sortConfig = (label, order_type) => {
  const sortQuery = [];
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
  if (label == "signIn") {
    return {
      id: data.id ?? null,
      name: data.name ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
    }
  }
}
