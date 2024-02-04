import {
    object,
    string,
    number,
    InferType,  
  } from "yup";
  
  export const basicLevelSchema = object({
    time: string().nonNullable(),
    level: number().nonNullable(),
  }).nonNullable()
  
  export type BasicLevel = Required<InferType<typeof basicLevelSchema>>