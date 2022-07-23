import {withNavigation} from '@react-navigation/compat';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  Image,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import Avatar from '../../components/Avatar';
import Background from '../../components/Background';
import InputTimeout from '../../components/InputTimeout';
import {getImg} from '../../utils/common';
import Message from './message';

const screenSize = Dimensions.get('window');

const Chat = ({navigation, listMessage, sendMessage, currentRoom}) => {
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

  const backHome = () => {
    navigation.pop();
  };

  const onSubmit = () => {
    // if (refInput.current) {
    //   refInput.current.blur();
    // }

    if (!state.emptyInput) {
      const content = refInput.current
        ? refInput.current.data()
        : state.inputData;
      sendMessage({content, type: 1});
      setState({inputData: '', emptyInput: true});
      if (refInput.current) {
        refInput.current.clearTime(true, '');
      }
    }
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

  const onChangeText = inputData => {
    setState({inputData});
  };
  const onChangeInput = data => {
    const emptyInput = data === '';
    if (state.emptyInput !== emptyInput) {
      setState({emptyInput});
    }
  };
  console.log(listMessage, 'listmessage');
  return (
    <Background>
      <View
        style={{
          display: 'flex',
          height: 120,
          paddingTop: 30,
          // backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {width: 1, height: 1},
          shadowOpacity: 0.4,
          shadowRadius: 3,
          elevation: 5,
        }}>
        <TouchableWithoutFeedback onPress={backHome}>
          <View
            style={{
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../assets/images/arrow-back.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'stretch',
              }}
              tintColor="white"
            />
          </View>
        </TouchableWithoutFeedback>

        <Avatar size={40} source={{uri: getImg(currentRoom?.avatar)}}></Avatar>

        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontWeight: '500',
            paddingLeft: 10,
          }}>
          {currentRoom?.name}
        </Text>

        <View
          style={{
            marginLeft: 'auto',
            marginRight: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/video-camera.png')}
            style={{
              width: 28,
              height: 28,
              marginRight: 10,
            }}
            tintColor="#fff"
          />
          <Image
            source={require('../../assets/images/information.png')}
            style={{
              width: 24,
              height: 24,
            }}
            tintColor="#fff"
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingTop: 20,
          paddingLeft: 5,
          paddingRight: 5,
          overflow: 'hidden',
          height: state.height - 140,
        }}>
        <ScrollView ref={refScroll} style={{paddingHorizontal: 5}}>
          {listMessage.map((item, idx) => (
            <Message
              key={idx}
              data={item}
              front={listMessage[idx - 1]?.fromId === item.fromId}
              end={listMessage[idx + 1]?.fromId === item.fromId}
              numberLike={listMessage[idx + 1]?.numberLike}
              listMessage={listMessage}
              maxWidth={state.width}
            />
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          paddingLeft: 30,
          height: 50,
          paddingVertical: 5,
          flexDirection: 'row',
          backgroundColor: 'white',
        }}>
        <InputTimeout
          ref={refInput}
          style={{
            backgroundColor: '#f2f3f5',
            height: 40,
            borderRadius: 18,
            paddingLeft: 10,
            flex: 1,
          }}
          onChange={onChangeInput}
          onChangeText={onChangeText}
          value={state.inputData}
          placeholder="Aa"></InputTimeout>
        <TouchableWithoutFeedback onPress={onSubmit}>
          <View
            style={{
              height: 40,
              width: 50,
              //   backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={
                state.emptyInput
                  ? require('../../assets/images/like.png')
                  : require('../../assets/images/send.png')
              }
              style={{
                width: 24,
                height: 24,
              }}
              tintColor="#4552ff"
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Background>
  );
};

export default connect(
  ({socket: {listMessage, currentRoom}}) => ({listMessage, currentRoom}),
  ({socket: {sendMessage}}) => ({sendMessage}),
)(withNavigation(Chat));
