import * as yup from 'yup';

export const autocate = {
  body: yup.object({
    call_id_k: yup.string().trim().required(),
    text_kskn: yup.string().trim().required(),
  }),
};
export const emotion = {
  body: yup.array().of(
    yup.object({
      domainId: yup.string().trim().required(),
      in: yup.string().trim().required(),
    }),
  ),
};

export const simple = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    size: yup.number().positive().integer().default(10),
    from: yup.number().integer().min(0).default(0),
  }),
};

export const multi = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    size: yup.number().positive().integer().default(10),
    from: yup.number().integer().min(0).default(0),
  }),
};
