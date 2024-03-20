import * as yup from 'yup';

export const resultTA = {
  body: yup.object({
    rec_id: yup.string().trim().required(),
    bnch_cd: yup.string().trim().required(),
  }),
};
