import authProvider from '@data-access/auth-provider';
import clientUtils from '@utils/client-utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';
// import {toast} from 'react-toastify';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */

// const dataInit = initStore();
export default {
  state: {
    auth: (async () => {
      try {
        const res = await AsyncStorage.getItem('auth');
        console.log(res, 'console.log(AsyncStorage.getItem());');
        const auth = JSON.parse(res) || {};
        if (auth?.userId) {
          return auth;
        }

        // let data = AsyncStorage.getItem('auth') || '';

        // console.log(data._W, 'data');

        return {
          userId: 1,
          avatar:
            'https://scontent.fhan3-5.fna.fbcdn.net/v/t39.30808-6/277585198_1576678479399787_4155074655708359256_n.jpg?_nc_cat=109&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=xUpBowVSwtQAX9CLEoM&tn=PBmWd8efRebvWDfN&_nc_ht=scontent.fhan3-5.fna&oh=00_AT_tJDVixW7mJfn5aMpLST4SAWt1LTwcKpBckKdcZ4hhSQ&oe=627C9B32',
        };
        // if (data) {
        //   const parseData = JSON.parse(data);
        //   clientUtils.auth = 'Bearer ' + parseData.token;
        //   clientUtils.token = parseData.token;
        //   return parseData;
        // }
      } catch (error) {
        console.log(error);
      }
      return {
        userId: 1,
        avatar:
          'https://scontent.fhan3-5.fna.fbcdn.net/v/t39.30808-6/277585198_1576678479399787_4155074655708359256_n.jpg?_nc_cat=109&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=xUpBowVSwtQAX9CLEoM&tn=PBmWd8efRebvWDfN&_nc_ht=scontent.fhan3-5.fna&oh=00_AT_tJDVixW7mJfn5aMpLST4SAWt1LTwcKpBckKdcZ4hhSQ&oe=627C9B32',
      };
    })(),
  },
  reducers: {
    updateData(state, payload = {}) {
      return {...state, ...payload};
    },
  },
  effects: dispatch => ({
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

              // toast.success('Đăng nhập thành công');
              dispatch.auth.updateData({auth: res.data});
              // setTimeout(() => {
              //   window.location.reload();
              // }, 5000);

              resolve(res);
            } else {
              // toast.error(res.message);
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
