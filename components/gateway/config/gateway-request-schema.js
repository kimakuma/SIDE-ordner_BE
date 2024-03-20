import * as yup from 'yup';

export const querylogParams = {
  body: yup.object({
    index: yup.string().required(),
    query: yup.string().required(),
    total: yup.number().integer().required(),
    took: yup.number().integer().required(),
  })
}

export const popquery = {
  query: yup.object({
    label: yup.string().trim().required()
  })
}

export const hotquery = {
  query: yup.object({
    label: yup.string().trim().required(),
  }),
};

export const recommend = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    label: yup.string().trim().required()
  })
}

export const related = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    label: yup.string().trim().required(),
  }),
}

export const theme = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    label: yup.string().trim().required(),
  }),
};

export const autocomplete = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    label: yup.string().trim().required(),
    middle: yup.boolean(),
    reverse: yup.boolean(),
    size: yup.number().integer().positive(),
    sort: yup.string().oneOf(['keyword', 'weight']),
  }),
}

export const speller = {
  query: yup.object({
    query: yup.string().trim().required(),
    label: yup.string().trim().required(),
    eng2kor: yup.boolean().default(true),
    distance: yup.number().integer(),
    overflow: yup.boolean().default(true),
  }),
};

