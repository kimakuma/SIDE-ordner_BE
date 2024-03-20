export const getOpenqueryConfig = async () => {
  return {
    index: '.openquery',
    body: {
      size: 10,
      from: 0,
      query: {
        term: {
        }
      }
    },
  };
};

export const getPopqueryConfig = async () => {
  return {
    index: '.openquery-popquery',
    body: {
      size: 1,
      query: {
        term: {
          label: {},
        },
      },
      sort: [
        {
          timestamp: {
            order: 'desc',
          },
        },
      ],
      _source: ['popqueryJSON', 'timestamp'],
    },
  };
};

export const getHotqueryConfig = async () => {
  return {
    index: '.openquery-popquery',
    body: {
      size: 1,
      query: {
        term: {
          label: {},
        },
      },
      sort: [
        {
          timestamp: {
            order: 'desc'
          }
        }
      ],
      _source: ['hotqueryJSON', 'timestamp'],
    },
  };
};

export const getRecommendConfig = async () => {
  return {
    index: '.openquery-recommend',
    body: {
      query: {
        bool: {
          must: [

          ]
        }
      },
      sort: [
        {
          timestamp: {
            order: 'desc'
          }
        }
      ]
    }
  };
}

export const getRelatedConfig = async () => {
  return {
    index: '.openquery-related',
    body: {
      query: {
        bool: {
          must: [],
        },
      },
      sort: [
        {
          timestamp: {
            order: 'asc',
          },
        },
      ],
    },
  };
};

export const getThemeConfig = async () => {
  return {
    index: '.openquery-theme',
    body: {
      size: 1,
      query: {
        bool: {
          must: [],
        },
      },
      sort: [
        {
          timestamp: {
            order: 'asc',
          },
        },
      ],
    },
  };
};

export const getAutocompleteConfig = async (params) => {
  return {
    index: `.openquery-autocomplete_${params.label}`,
    body: {
      size: 1,
      query: {
        multi_match: {
          query: "",
          fields: [],
        },
      },
      highlight: {
        pre_tags: "¶HS¶",
        post_tags: "¶HE¶",
        fields: {},
      },
      sort: {},
    },
  };
};

export const getSpellerConfig = async () => {

}

