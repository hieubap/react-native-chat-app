import React, {useRef, useState} from 'react';
import {Dimensions, Text, TouchableWithoutFeedback, View} from 'react-native';
import ButtonShadow from '../../components/ButtonShadow';
import {withNavigation} from '@react-navigation/compat';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import FormItem from '../../components/FormItem';
import {refModal} from '../..';

const screen = Dimensions.get('window');

const styleInput = {
  backgroundColor: '#f2f3f5',
  height: 50,
  fontSize: 16,
  borderRadius: 8,
  paddingLeft: 20,
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderColor: '#bbb',
};

const FormLogin = ({changeView, handleSubmit, navigation, onLogin}) => {
  const [state, _setState] = useState({});
  const setState = data => {
    _setState(pre => ({...pre, ...data}));
  };
  const refPassword = useRef();

  const onSubmit = values => {
    onLogin(values).then(() => {
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

  return (
    <View
      style={{
        width: (screen.width * 8) / 10,
        // height: (screen.width * 8) / 10,
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
      <FormItem
        validate={[
          {
            key: 'required',
            message: 'Vui lòng nhập username',
          },
        ]}
        name="username"
        label="Username:"
        placeholder="Nhập username"
        style={styleInput}
      />
      <FormItem
        validate={[
          {
            key: 'required',
            message: 'Vui lòng nhập mật khẩu',
          },
        ]}
        secureTextEntry
        name="password"
        label="Mật khẩu:"
        placeholder="Nhập mật khẩu"
        style={styleInput}
      />
      {/* <InputTimeout
        // style={}
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
      /> */}
      <ButtonShadow style={{marginTop: 20}} onClick={handleSubmit(onSubmit)}>
        Login
      </ButtonShadow>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingTop: 10,
        }}>
        <Text>Nếu bạn chưa có tài khoản?</Text>
        <TouchableWithoutFeedback onPress={changeView}>
          <Text style={{color: '#73b7c9', paddingLeft: 5}}>Đăng ký ngay</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

FormLogin.propTypes = {};

export default reduxForm({
  form: 'registerForm',
})(
  withNavigation(
    connect(
      () => ({}),
      ({auth: {onLogin}}) => ({onLogin}),
    )(FormLogin),
  ),
);
