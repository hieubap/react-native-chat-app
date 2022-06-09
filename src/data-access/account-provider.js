import {API} from '@variable/api';
import clientUtils from '@utils/client-utils';
import {combineUrlParams} from '@utils/common';
import baseProvider from './base-provider';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  ...baseProvider(API.account),
  getUser: ({page = 0, size = 10, ...param} = {}) => {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi(
          'get',
          combineUrlParams(`${API.account}`, {
            page,
            size: 999,
            ...param,
          }),
          {},
        )
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  changeAvatar: ({avatar} = {}) => {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi('put', `${API.account}/avatar`, {avatar})
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
};
