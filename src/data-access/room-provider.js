import {API} from '@variable/api';
import baseProvider from './base-provider';
import {combineUrlParams} from '@utils/common';
import clientUtils from '@utils/client-utils';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  ...baseProvider(API.room),
  create: (body = {}) => {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi('post', `${API.room}/create`, body)
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  addUser: (userId, roomId) => {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi(
          'post',
          combineUrlParams(`${API.room}/join/${roomId}/${userId}`, {}),
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
};
