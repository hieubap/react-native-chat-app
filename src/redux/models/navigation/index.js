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
              navigation.replace('Login');
            },
          );
      }
    },
  }),
};
