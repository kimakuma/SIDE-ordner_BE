export const simple = () => ({
  index: ['news', 'stock'],
  field: {
    search: ['title', 'content'],
    highlight: ['reporter', 'title', 'content'],
    result: ['title'],
  },
  body: {
    from: 0,
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
      },
    },
    highlight: {
      fields: {},
    },
    _source: [],
  },
});

export const multi = () => [
  {
    index: 'news',
    field: {
      search: ['title', 'content'],
      highlight: ['reporter', 'title', 'content'],
      result: ['title'],
    },
    body: {
      from: 0,
      size: 0,
      query: {
        bool: {
          must: [],
          filter: [],
          should: [],
        },
      },
      highlight: {
        fields: {},
      },
      _source: [],
    },
  },
  {
    index: 'stock',
    field: {
      search: ['title', 'content'],
      highlight: ['reporter', 'title', 'content'],
      result: ['title'],
    },
    body: {
      from: 0,
      size: 0,
      query: {
        bool: {
          must: [],
          filter: [],
          should: [],
        },
      },
      highlight: {
        fields: {},
      },
      _source: [],
    },
  },
];
