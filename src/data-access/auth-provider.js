import {API} from '@variable/api';
import clientUtils from '@utils/client-utils';
import {combineUrlParams} from '@utils/common';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  login(body) {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi('post', combineUrlParams(`/account/login`), body, true)
        .then(resolve)
        .catch(reject);
    });
  },
  register(body) {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi('post', `${API.account}/register`, body, true)
        .then(resolve)
        .catch(reject);
    });
  },
  changeAvatar(file) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      clientUtils
        .upload('put', `${API.account}/avatar`, formData)
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
};
