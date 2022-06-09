import {withNavigation} from '@react-navigation/compat';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import InputTimeout from '../../components/InputTimeout';

const screenSize = Dimensions.get('window');

const Login = ({
  navigation,
  onLogin,
  listMessage,
  sendMessage,
  currentRoom,
}) => {
  const [state, _setState] = useState({
    width: screenSize.width,
    height: screenSize.height,
    emptyInput: true,
    inputData: '',
  });
  const setState = data => {
    _setState(pre => ({...pre, ...data}));
  };

  const refScroll = useRef();
  const refInput = useRef();

  const onSubmit = () => {
    if (!state.username || !state.password) {
      return;
    }
    console.log('login ...');
    onLogin({username: state.username, password: state.password}).then(() => {
      navigation.push('Home');
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
    <View
      style={{
        backgroundColor: '#dfe0e4',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: screenSize.width,
          height: screenSize.height / 2,
          backgroundColor: '#7972e5',
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }}></View>
      <View
        style={{
          //   paddingLeft: 30,
          width: (screenSize.width * 8) / 10,
          height: (screenSize.width * 8) / 10,
          backgroundColor: 'white',
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 50,
          //   borderWidth: 1,
        }}>
        <InputTimeout
          ref={refInput}
          style={{
            backgroundColor: '#f2f3f5',
            height: 50,
            fontSize: 16,
            borderRadius: 8,
            paddingLeft: 20,
            marginBottom: 20,
          }}
          onChange={onChangeInput}
          onChangeText={onChangeText('username')}
          value={state.username}
          placeholder="Username"
        />
        <InputTimeout
          ref={refInput}
          style={{
            backgroundColor: '#f2f3f5',
            height: 50,
            fontSize: 16,
            borderRadius: 8,
            paddingLeft: 20,
            marginBottom: 20,
          }}
          onChange={onChangeInput}
          onChangeText={onChangeText('password')}
          value={state.password}
          placeholder="Password"
        />
        <TouchableWithoutFeedback onPress={onSubmit}>
          <View
            style={{
              height: 40,
              backgroundColor: '#837ded',
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 16}}>Login</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default connect(
  ({socket: {listMessage, currentRoom}}) => ({listMessage, currentRoom}),
  ({socket: {sendMessage}, auth: {onLogin}}) => ({sendMessage, onLogin}),
)(withNavigation(Login));
