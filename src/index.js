import {NavigationContainer} from '@react-navigation/native';
import React, {createRef} from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import LottieLoading from './components/Loading';
import ModalConfirm from './components/ModalConfirm';
import Navigation from './navigation';
import store from './redux';

export const refModal = createRef();
export const refLoading = createRef();

export default function App() {
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={'light-content'}></StatusBar>
          <Navigation />
          <ModalConfirm ref={refModal}></ModalConfirm>
          <LottieLoading ref={refLoading} />
        </NavigationContainer>
      </Provider>
    </>
  );
}
