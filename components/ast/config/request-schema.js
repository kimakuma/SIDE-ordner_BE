import * as yup from 'yup';

export const keyword = {
  body: yup.object({
    keyword: yup.string().trim().required(),
    bnch_cd: yup.string().trim()
  }),
};