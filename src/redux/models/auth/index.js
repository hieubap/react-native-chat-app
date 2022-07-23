import authProvider from '@data-access/auth-provider';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  state: {
    auth: {},
  },
  reducers: {
    updateData(state, payload = {}) {
      return {...state, ...payload};
    },
  },
  effects: dispatch => ({
    initAuth: () => {
      AsyncStorage.getItem('auth').then(res => {
        const auth = res ? JSON.parse(res) : {};
        dispatch.auth.updateData({auth});
      });
    },
    onLogin: (payload, {}) => {
      // if (!info?.ip) return;
      return new Promise((resolve, reject) => {
        authProvider
          .login({
            ...payload,
            deviceInfo: {
              ip: 'ip',
              nameDevice: 'SAMSUNG A32',
              address: 'ko có',
              application: 'CHAT APP',
            },
          })
          .then(res => {
            if (res && res.code === 0) {
              AsyncStorage.setItem('auth', JSON.stringify(res?.data));
              dispatch.auth.updateData({auth: res.data});
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    onRegister: (payload, state) => {
      return new Promise((resolve, reject) => {
        authProvider
          .register(payload)
          .then(res => {
            if (res && res.code === 0) {
              // toast.success(
              //   'Đăng ký thành công. Vui lòng đăng nhập vào hệ thống',
              // );
              resolve(res);
            } else {
              // toast.error(res.message);
              reject(res);
            }
          })
          .catch(reject);
      });
    },
    changeAvatar: (file, {auth: {auth}}) => {
      authProvider.changeAvatar(file).then(res => {
        if (res && res.code === 0) {
          dispatch.auth.updateData({
            auth: {...auth, avatar: res.data?.avatar},
          });
          AsyncStorage.setItem(
            'auth',
            JSON.stringify({...auth, avatar: res.data?.avatar}),
          );

          // toast.success('Đổi ảnh đại diện thành công');
        }
      });
    },
  }),
};
