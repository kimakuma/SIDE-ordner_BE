import * as yup from 'yup';

export const truckList = {
  query: yup.object({})
};

export const truckDetail = {
  query: yup.object({
    truckId: yup.string().trim().required(),
  })
};

export const list = {
  query: yup.object({
    userId: yup.string().trim().required(),
  })
};

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

export const reserve = {
  body: yup.object({
    userId: yup.string().trim().required(),
    truckId: yup.number().integer().required(),
    truckName: yup.string().trim().required(),
    startDate: yup.string().trim().required(),
    endDate: yup.string().trim().required(),
  }),
};
