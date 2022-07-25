import React, {useRef, useState} from 'react';
import {Dimensions, Text, TouchableWithoutFeedback, View} from 'react-native';
import ButtonShadow from '../../components/ButtonShadow';
import {reduxForm, SubmissionError} from 'redux-form';
import FormItem from '../../components/FormItem';
import {connect} from 'react-redux';
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

const FormRegister = ({handleSubmit, changeView, onRegister}) => {
  const onSubmit = ({password2, ...values}) => {
    console.log(values, 'values');
    if (password2 !== values.password) {
      throw new SubmissionError({
        password2: 'Mật khẩu không đúng',
      });
    }

    onRegister(values).then(() => {
      refModal.current &&
        refModal.current.show(
          {
            type: 'success',
            content: 'Đăng ký thành công. Vui lòng đăng nhập hệ thống',
          },
          changeView,
        );
    });
  };

  return (
    <View
      style={{
        width: (screen.width * 8) / 10,
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
        }}>
        <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>
          Đăng ký
        </Text>
      </View>
      <FormItem
        validate={[
          {
            key: 'required',
            message: 'Vui lòng nhập họ tên',
          },
        ]}
        name="fullName"
        label="Họ tên:"
        placeholder="Nhập họ tên"
        style={styleInput}
      />
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
      <FormItem
        validate={[
          {
            key: 'required',
            message: 'Vui lòng nhập mật khẩu',
          },
        ]}
        secureTextEntry
        name="password2"
        label="Nhập lại mật khẩu:"
        placeholder="Nhập mật khẩu"
        style={styleInput}
      />
      <ButtonShadow style={{marginTop: 20}} onClick={handleSubmit(onSubmit)}>
        Đăng ký
      </ButtonShadow>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingTop: 10,
        }}>
        <Text>Nếu bạn đã có tài khoản?</Text>
        <TouchableWithoutFeedback onPress={changeView}>
          <Text style={{color: '#73b7c9', paddingLeft: 5}}>Đăng nhập</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

FormRegister.propTypes = {};

export default reduxForm({
  form: 'registerForm',
})(
  connect(
    () => ({}),
    ({auth: {onRegister}}) => ({onRegister}),
  )(FormRegister),
);
