import {Keyboard} from 'react-native';
import {refLoading, refModal} from '..';

export const UrlServer = () => {
  const domain = global.origin;
  const localhost = true;
  return localhost ? 'http://localhost:8800' : 'http://45.13.132.247:8800';
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
          s.json()
            .then(res => {
              console.log('response', res);
              if (res.code === 401) {
                // localStorage.clear();
                // window.location.href = "/auth/login";
              } else if (res.code !== 0) {
                refModal.current &&
                  refModal.current.show({
                    type: 'error',
                    content: res.message,
                  });
              }
              resolve(res);
            })
            .catch(e => {
              reject(e);
            });
        })
        .catch(e => {
          if (e && e.status === 401) {
            localStorage.clear();
            // window.location.href = "/auth/login";
          }
          reject(e);
        });
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

      console.log('request', UrlServer() + url, fetchParam);

      if (refLoading.current) {
        refLoading.current.loading(true);
      }
      Keyboard.dismiss();
      return fetch(UrlServer() + url, fetchParam)
        .then(json => {
          console.log(json, 'json');
          if (!json.ok) {
            reject(json);
          } else {
            resolve(json);
          }
        })
        .catch(e => {
          console.log(e, 'catch');
          reject(e);
        })
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
          s.json()
            .then(val => {
              if (val.code === 401) {
                localStorage.clear();
                // window.location.href = "/auth/login";
              }
              resolve(val);
            })
            .catch(e => {
              reject(e);
            });
        })
        .catch(e => {
          if (e && e.status === 401) {
            localStorage.clear();
            // window.location.href = "/auth/login";
          }
          reject(e);
        });
    });
  },
};
