import {withNavigation} from '@react-navigation/compat';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import Avatar from '../../components/Avatar';
import {getImg} from '../../utils/common';
import {imgDefault} from '../../variable';

const height = Dimensions.get('window').height;

const testData = () => {
  const output = ['Tạo cuộc gọi thoại'];
  for (let i = 0; i < 50; i++) {
    output.push(`Linh Vũ Hương (${i})`);
  }
  return output;
};
const userActive = testData();

const Home = ({
  connect,
  auth,
  navigation,
  listRoom,
  updateData,
  getListMessage,
}) => {
  const [state, _setState] = useState({onTop: true});
  const setState = data => {
    _setState(pre => ({...pre, ...data}));
  };
  const gotoChat = () => {
    navigation.push('Chat');
  };
  useEffect(() => {
    connect();
  }, []);

  const onScroll = event => {
    const onTop = event.nativeEvent.contentOffset.y === 0;
    if (onTop !== state.onTop) {
      setState({onTop});
    }
  };

  const selectRoom = room => () => {
    console.log('click select room');
    updateData({currentRoomId: room?.id, currentRoom: room});
    getListMessage(room?.id);
    gotoChat();
  };

  console.log(listRoom, 'list room');

  return (
    <View style={{backgroundColor: '#fff'}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 70,
          padding: 10,
          alignItems: 'center',
        }}>
        <View>
          <Avatar source={{uri: getImg(auth?.avatar)}} size={50}></Avatar>
        </View>
        <View style={{flex: 1, paddingLeft: 10}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Đoạn chat</Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.push('Login');
          }}>
          <View>
            <Image
              source={require('../../assets/images/edit.png')}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          height: 50,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}>
        <View
          style={{
            backgroundColor: '#f7f5f6',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 22,
          }}>
          <Image
            source={require('../../assets/images/search.png')}
            style={{
              width: 16,
              height: 16,
              marginLeft: 15,
            }}
          />
          <TextInput
            style={{
              flex: 1,
              padding: 0,
              paddingLeft: 10,
              height: 38,
            }}
            placeholder="Tìm kiếm"
          />
        </View>
      </View>
      <View
        style={{
          overflow: 'hidden',
          height: 105,
          paddingBottom: 5,
        }}>
        <View
          style={{
            height: 100,
            backgroundColor: '#fff',
            ...(state.onTop
              ? {}
              : {
                  shadowColor: '#000',
                  shadowOffset: {width: 1, height: 1},
                  shadowOpacity: 0.4,
                  shadowRadius: 3,
                  elevation: 3,
                }),
          }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {userActive?.map((item, index) => (
              <View
                key={index}
                style={{
                  width: 80,
                  display: 'flex',
                  alignItems: 'center',
                }}
                onPress={() => {}}>
                <Avatar></Avatar>
                <Text style={{textAlign: 'center', fontSize: 12}}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View>
        <ScrollView
          onScroll={onScroll}
          style={{height: height - 220, marginTop: -5}}
          showsVerticalScrollIndicator={false}>
          {listRoom?.map((item, index) => (
            <TouchableWithoutFeedback
              style={{
                flexDirection: 'row',
                height: 75,
                alignItems: 'center',
                paddingLeft: 10,
              }}
              key={index}
              onPress={selectRoom(item)}>
              <View>
                <Avatar source={{uri: getImg(item.avatar)}}></Avatar>
              </View>
              <View style={{paddingLeft: 15}}>
                <Text>{item.name}</Text>
                <Text style={{fontSize: 13}}>Bạn đã gửi 1 ảnh</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default connect(
  ({socket: {listRoom}, auth: {auth}}) => ({listRoom, auth}),
  ({socket: {connect, getListMessage, updateData}}) => ({
    connect,
    getListMessage,
    updateData,
  }),
)(withNavigation(Home));
