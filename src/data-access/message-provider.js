import {API} from '@variable/api';
import baseProvider from "./base-provider";

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  ...baseProvider(API.message),
};
