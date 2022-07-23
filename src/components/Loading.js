import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import LottieAnimationView from 'lottie-react-native';

const LottieLoading = (props, ref) => {
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    loading: load => {
      console.log(load, 'load ...');
      setLoading(load);
    },
  }));

  return (
    <Modal transparent visible={loading}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            position: 'absolute',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
        ]}>
        <LottieAnimationView
          source={require('../assets/json/66731-loading.json')}
          loop={true}
          autoPlay={true}
        />
      </View>
    </Modal>
  );
};

export default forwardRef(LottieLoading);
