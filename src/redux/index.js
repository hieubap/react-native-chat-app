import {init} from '@rematch/core';
import models from './models';
import {reducer as form} from 'redux-form';

const store = init({
  models,
  redux: {
    reducers: {
      form,
    },
  },
});

const {getState, dispatch} = store;

export {getState, dispatch};
export default store;
