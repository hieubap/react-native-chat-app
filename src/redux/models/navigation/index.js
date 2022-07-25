import AsyncStorage from '@react-native-async-storage/async-storage';
import {refModal} from '../../..';

export default {
  state: {
    mode: 1,
  },
  reducers: {
    updateData(state, payload = {}) {
      return {...state, ...payload};
    },
  },
  effects: dispatch => ({
    goBack: (navigation, state) => {
      if (!navigation) return;

      const stateNavigate = navigation.getState();
      if (stateNavigate.index === 0) {
        refModal.current &&
          refModal.current.show(
            {
              content: 'Bạn có chắc muốn đăng xuất ?',
            },
            () => {
              AsyncStorage.clear();
              dispatch.auth.updateData({auth: {}});
              dispatch.socket.updateData({isConnect: false});
              state.socket.stompClient?.disconnect();
              navigation.replace('Login');
            },
          );
      }
    },
  }),
};
