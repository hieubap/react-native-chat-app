import {withNavigation} from '@react-navigation/compat';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Keyboard, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {refModal} from '../..';
import Background from '../../components/Background';
import FormLogin from './FormLogin';
import FormRegister from './FormRegister';

const screen = Dimensions.get('window');

const Login = ({
  auth,
  navigation,
  onLogin,
  listMessage,
  sendMessage,
  currentRoom,
}) => {
  const [state, _setState] = useState({
    width: screen.width,
    height: screen.height,
    emptyInput: true,
    inputData: '',
    isLogin: true,
  });
  const setState = data => {
    _setState(pre => ({...pre, ...data}));
  };

  const refScroll = useRef();

  const scrollBottom = (payload = {animated: false}) => {
    if (refScroll.current) {
      refScroll.current.scrollToEnd(payload);
    }
  };

  useEffect(() => {
    scrollBottom({animated: true});
  }, [listMessage]);

  const eventKeyBoard = e => {
    setState({
      height: Dimensions.get('window').height - e.endCoordinates.height,
    });
    setTimeout(() => {
      scrollBottom({animated: true});
    }, 50);
  };

  useEffect(() => {
    scrollBottom();
    Keyboard.addListener('keyboardDidShow', eventKeyBoard);
    Keyboard.addListener('keyboardDidHide', eventKeyBoard);
  }, []);

  const changeView = isLogin => () => {
    setState({isLogin});
  };

  return (
    <Background>
      <View
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            marginTop: -50,
            marginBottom: 50,
            zIndex: 2,
          }}>
          <Text style={{fontSize: 40, color: 'white', fontWeight: 'bold'}}>
            Chat App
          </Text>
        </View>
        {state.isLogin ? (
          <FormLogin changeView={changeView(false)} />
        ) : (
          <FormRegister changeView={changeView(true)} />
        )}
      </View>
    </Background>
  );
};

export default connect(
  ({socket: {listMessage, currentRoom}, auth: {auth}}) => ({
    listMessage,
    currentRoom,
    auth,
  }),
  ({socket: {sendMessage}, auth: {onLogin}}) => ({sendMessage, onLogin}),
)(withNavigation(Login));
