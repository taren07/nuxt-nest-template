import * as yup from 'yup'

export const userSchema = yup.object({
  email: yup.string().required('Email is required').email('Email must be valid'),
  name: yup.string().required('Name is required'),
  age: yup.number().nullable().positive('Age must be positive').integer('Age must be an integer')
})

export type UserFormData = yup.InferType<typeof userSchema>