import {combineUrlParams} from '@utils/common';
import clientUtils from '@utils/client-utils';

const provider = (API = '') => ({
  search({page = 0, size = 10, ...param}) {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi(
          'get',
          combineUrlParams(`${API}`, {
            page,
            size,
            ...param,
          }),
          {},
        )
        .then(resolve)
        .catch(reject);
    });
  },
  detail(id) {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi('get', `${API}/${id}`, {})
        .then(resolve)
        .catch(reject);
    });
  },
  post(body) {
    return new Promise((resolve, reject) => {
      clientUtils.requestApi('post', API, body).then(resolve).catch(reject);
    });
  },
  put(body, id) {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi('put', `${API}/${id}`, body)
        .then(resolve)
        .catch(reject);
    });
  },
  delete(id) {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi('delete', `${API}/${id}`, {})
        .then(resolve)
        .catch(reject);
    });
  },
});

export default provider;
