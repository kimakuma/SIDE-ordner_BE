import * as yup from 'yup';

export const test = {};

export const schemaSample = {
  body: yup.object({
    srch_type: yup.array().of(yup.string().trim().oneOf(["0", "1", "2", "3"])).default(["0"]),
    srch_wd: yup.array().required(),
    category: yup.array(),
    start_dt: yup.string().trim(),
    end_dt: yup.string().trim(),
    exception_word: yup.array(),
    order_type: yup.string().trim().oneOf(["1", "2", "3", "4", "5"]).default("1"),
    org_cd: yup.string().trim(),
    st_row: yup.number().integer().min(0).required().default(0),
    en_row: yup.number().integer().required().default(10),
  }),
};