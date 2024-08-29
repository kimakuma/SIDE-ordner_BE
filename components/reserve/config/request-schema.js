import * as yup from 'yup';

export const reserveList = {
  query: yup.object({
    userId: yup.string().trim().required(),
  })
};

export const truckInfo = {
  query: yup.object({
    truckId: yup.string().trim().required(),
  })
};

export const reserve = {
  body: yup.object({
    userId: yup.number().integer().required(),
    truckId: yup.number().integer().required(),
    truckName: yup.string().trim().required(),
    startDate: yup.string().trim().required(),
    endDate: yup.string().trim().required(),
    people: yup.string().trim().required(),
    msg: yup.string().trim(),
  }),
};

export const truckList = {
  query: yup.object({})
};


