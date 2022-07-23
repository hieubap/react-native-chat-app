import {withNavigation} from '@react-navigation/compat';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {refModal} from '../..';
import Background from '../../components/Background';
import ButtonShadow from '../../components/ButtonShadow';
import InputTimeout from '../../components/InputTimeout';

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
  });
  const setState = data => {
    _setState(pre => ({...pre, ...data}));
  };

  const refScroll = useRef();
  const refPassword = useRef();

  const onSubmit = () => {
    if (!state.username || !state.password) {
      return;
    }
    onLogin({username: state.username, password: state.password}).then(() => {
      refModal.current &&
        refModal.current.show(
          {
            type: 'success',
            content: 'Đăng nhập thành công',
          },
          () => {
            navigation.replace('Home');
          },
        );
    });
  };

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

  const onChangeText = key => inputData => {
    setState({[key]: inputData});
  };
  const onChangeInput = data => {
    const emptyInput = data === '';
    if (state.emptyInput !== emptyInput) {
      setState({emptyInput});
    }
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
        <View
          style={{
            width: (screen.width * 8) / 10,
            height: (screen.width * 8) / 10,
            backgroundColor: 'white',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 50,
            borderBottomWidth: 4,
            borderRightWidth: 4,
            borderLeftWidth: 1,
            borderLeftColor: '#ddd',
            borderRightColor: '#888',
            borderBottomColor: '#888',
          }}>
          <View
            style={{
              alignItems: 'center',
              paddingBottom: 30,
            }}>
            <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>
              Login
            </Text>
          </View>
          <InputTimeout
            style={{
              backgroundColor: '#f2f3f5',
              height: 50,
              fontSize: 16,
              borderRadius: 8,
              paddingLeft: 20,
              marginBottom: 20,
              borderBottomWidth: 1,
              borderRightWidth: 1,
              borderColor: '#bbb',
            }}
            onChange={onChangeInput}
            onChangeText={onChangeText('username')}
            value={state.username}
            placeholder="Username"
            returnKeyType="next"
            onSubmitEditing={() => {
              console.log(refPassword, 'refPassword');
              refPassword.current && refPassword.current.focus();
            }}
          />
          <InputTimeout
            ref={refPassword}
            style={{
              backgroundColor: '#f2f3f5',
              height: 50,
              fontSize: 16,
              borderRadius: 8,
              borderBottomWidth: 1,
              borderRightWidth: 1,
              borderColor: '#bbb',
              paddingLeft: 20,
              marginBottom: 20,
            }}
            secureTextEntry
            onChange={onChangeInput}
            onChangeText={onChangeText('password')}
            value={state.password}
            placeholder="Password"
            // returnKeyType="next"
          />
          <View></View>
          <ButtonShadow onClick={onSubmit}>Login</ButtonShadow>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingTop: 10,
            }}>
            <Text>Not a member yet?</Text>
            <TouchableWithoutFeedback>
              <Text style={{color: '#73b7c9', paddingLeft: 5}}>Sign up</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
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
