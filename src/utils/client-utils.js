import {Keyboard} from 'react-native';
import {refLoading} from '..';

export const UrlServer = () => {
  return 'http://localhost:8800';
};

export default {
  auth: '',
  token: '',
  serverApi: UrlServer(),
  requestApi(methodType, url, body, ignoreAuth) {
    return new Promise((resolve, reject) => {
      if (!body) body = {};
      if (methodType.toLowerCase() !== 'get') {
        body = JSON.stringify(body);
      }
      this.requestFetch(
        methodType,
        url && url.indexOf('http') === 0 ? url : url,
        ignoreAuth
          ? {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }
          : {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: this.auth,
            },
        body,
      )
        .then(s => {
          s.json().then(resolve).catch(reject);
        })
        .catch(reject);
    });
  },
  requestFetch(methodType, url, headers, body) {
    return new Promise((resolve, reject) => {
      let fetchParam = {
        method: methodType,
        headers,
      };

      if (methodType.toLowerCase() !== 'get') {
        fetchParam.body = body;
      }

      console.log('==> REQUEST', UrlServer() + url, fetchParam);

      if (refLoading.current) {
        refLoading.current.loading(true);
      }
      Keyboard.dismiss();
      return fetch(UrlServer() + url, fetchParam)
        .then(json => {
          console.log('<== RESPONSE:', json);
          if (!json.ok) {
            reject(json);
          } else {
            resolve(json);
          }
        })
        .catch(reject)
        .finally(() => {
          if (refLoading.current) {
            refLoading.current.loading(false);
          }
        });
    });
  },
  upload(methodType, url, form) {
    return new Promise((resolve, reject) => {
      return this.requestFetch(
        methodType,
        url && url.indexOf('http') === 0 ? url : url,
        {
          Authorization: this.auth,
        },
        form,
      )
        .then(s => {
          s.json().then(resolve).catch(reject);
        })
        .catch(reject);
    });
  },
};
