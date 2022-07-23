import {withNavigation} from '@react-navigation/compat';
import AnimatedLottieView from 'lottie-react-native';
import React, {useEffect, useRef} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import useFinal from '../../hook/useFinal';

const Spash = ({navigation, initAuth, auth}) => {
  useFinal(
    initAuth,
    () => {
      console.log(auth, 'auth spash');

      if (auth.userId) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    },
    [auth],
  );

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <AnimatedLottieView
        source={require('../../assets/json/30786-online-chat.json')}
        loop
        autoPlay
        style={{width: 400, height: 400}}
      />
      <Text style={{position: 'absolute', fontWeight: 'bold', bottom: 50}}>
        Sản phẩm được code bởi dev Hiếu Ngô
      </Text>
    </View>
  );
};

export default connect(
  ({auth: {auth}}) => ({auth}),
  ({auth: {initAuth}}) => ({initAuth}),
)(withNavigation(Spash));
