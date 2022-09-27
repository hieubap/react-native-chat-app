import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Animated, Dimensions, Image, Modal, Text, View} from 'react-native';
import ButtonShadow from './ButtonShadow';

const screen = Dimensions.get('screen');

const ModalConfirm = (props, ref) => {
  const refOk = useRef();
  const refCancel = useRef();
  const refScale = useRef(new Animated.Value(0));
  const [state, _setState] = useState({
    visible: false,
    okText: '',
    cancelText: '',
  });
  const setState = data => {
    _setState(pre => ({...pre, ...data}));
  };
  useImperativeHandle(ref, () => ({
    show: (
      {type = 'warning', content, okText = 'Xác nhận', cancelText = 'Hủy'} = {},
      onSuccess,
      onCancel,
    ) => {
      setState({visible: true, type, content, okText, cancelText});
      refOk.current = onSuccess;
      refCancel.current = onCancel;
      Animated.spring(refScale.current, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    },
  }));

  const [source, colorSubmitButton] = useMemo(() => {
    if (state.type === 'error')
      return [require('../assets/images/error.png'), '#DD3333'];
    if (state.type === 'warning')
      return [require('../assets/images/warning.png'), '#FF5D00'];

    return [require('../assets/images/success.png'), '#01A601'];
  }, [state.type]);

  const setTimeClose = () => {
    setTimeout(() => {
      setState({visible: false});
    }, 50);
    Animated.spring(refScale.current, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const onCancel = () => {
    if (refCancel.current) refCancel.current();
    setTimeClose();
  };

  const onOk = () => {
    setTimeClose();
    if (refOk.current) refOk.current();
  };

  return (
    <Modal transparent visible={state.visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.View
          style={{
            width: (screen.width * 4) / 5,
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 20,
            elevation: 20,
            transform: [{scale: refScale.current}],
          }}>
          {/* <TouchableWithoutFeedback
            onPress={() => {
              setState({visible: false});
            }}>
            <Image
              source={require('../assets/images/close.png')}
              style={{
                width: 28,
                height: 28,
                position: 'absolute',
                right: 10,
                top: 5,
                //   backgroundColor: 'black',
              }}></Image>
          </TouchableWithoutFeedback> */}

          <View
            style={{
              paddingTop: 30,
              alignItems: 'center',
              //   borderWidth: 1,
              display: 'flex',
            }}>
            <Image
              source={source}
              style={{
                width: 100,
                height: 100,
                // backgroundColor: 'red',
                resizeMode: 'stretch',
              }}
            />
            <Text
              style={{
                marginVertical: 10,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              {state.content}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignSelf: 'stretch',
                marginTop: 20,
              }}>
              {state.type === 'warning' && (
                <ButtonShadow
                  style={{width: '40%', backgroundColor: '#f5f5f5'}}
                  styleText={{color: 'black'}}
                  onClick={onCancel}>
                  {state.cancelText}
                </ButtonShadow>
              )}
              <ButtonShadow
                style={{width: '40%', backgroundColor: colorSubmitButton}}
                onClick={onOk}>
                {state.okText}
              </ButtonShadow>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default forwardRef(ModalConfirm);
