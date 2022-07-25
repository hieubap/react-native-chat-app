import {withNavigation} from '@react-navigation/compat';
import AnimatedLottieView from 'lottie-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import useFinal from '../../hook/useFinal';

const screen = Dimensions.get('screen');

const Splash = ({navigation, initAuth, auth}) => {
  const [state, _setState] = useState({showSkip: false});
  const setState = data => {
    _setState(pre => ({...pre, ...data}));
  };

  useFinal(
    initAuth,
    () => {
      console.log(auth, 'auth spash');
      setState({showSkip: true});
    },
    [auth],
  );

  const onSkip = () => {
    if (auth.userId) {
      navigation.replace('Home');
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <StatusBar barStyle={'dark-content'}></StatusBar>
      <TouchableWithoutFeedback onPress={onSkip}>
        <View
          style={{
            display: state.showSkip ? 'flex' : 'none',
            position: 'absolute',
            top: 80,
            right: 0,
            backgroundColor: '#FF4F5B',
            padding: 10,
            paddingHorizontal: 25,
          }}>
          <Text style={{color: 'white'}}>Skip</Text>
        </View>
      </TouchableWithoutFeedback>
      <AnimatedLottieView
        source={require('../../assets/json/30786-online-chat.json')}
        loop
        autoPlay
        style={{width: 400, height: 400}}
      />
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 20,
        }}>
        <Text
          style={{
            color: '#999',
            width: (screen.width * 4) / 5,
            textAlign: 'center',
          }}>
          Chúc bạn có những giây phút trải nghiệm vui vẻ nếu có bug vui lòng
          phản hồi lại cho dev để sản phẩm ngày càng hoàn thiện hơn
        </Text>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            marginTop: 90,
            textAlign: 'center',
          }}>
          Sản phẩm được tài trợ bởi{'\n'}
          DEV HIẾU NGÔ
        </Text>
      </View>
    </View>
  );
};

export default connect(
  ({auth: {auth}}) => ({auth}),
  ({auth: {initAuth}}) => ({initAuth}),
)(withNavigation(Splash));
