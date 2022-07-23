import React from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';

const screen = Dimensions.get('window');

const Background = ({children, style}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}>
          <Image
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: screen.width,
              height: (screen.height * 7) / 10,
              // backgroundColor: '#7972e5',
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
            }}
            source={require('../assets/images/bg4.png')}
          />
          {children}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Background;
