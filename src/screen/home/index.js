import {withNavigation} from '@react-navigation/compat';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import Avatar from '../../components/Avatar';
import Background from '../../components/Background';
import InputTimeout from '../../components/InputTimeout';
import {getImg, timeFromNow} from '../../utils/common';
import {imgDefault} from '../../variable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalCreate from './ModalCreate';

const height = Dimensions.get('window').height;

const Home = ({
  connect,
  auth,
  navigation,
  listRoom,
  getAllUser,
  updateData,
  getListMessage,
  goBack,
}) => {
  const refCreate = useRef();
  const [state, _setState] = useState({onTop: true});
  const setState = data => {
    _setState(pre => ({...pre, ...data}));
  };
  const gotoChat = () => {
    navigation.push('Chat');
  };
  useEffect(() => {
    connect();
    getAllUser();
  }, []);

  const onScroll = event => {
    const onTop = event.nativeEvent.contentOffset.y === 0;
    if (onTop !== state.onTop) {
      setState({onTop});
    }
  };

  const selectRoom = room => () => {
    if (state.click) return;

    setState({click: true});
    setTimeout(() => {
      setState({click: false});
    }, 500);
    updateData({currentRoomId: room?.id, currentRoom: room});
    getListMessage(room?.id);
    gotoChat();
  };

  const showCreateRoom = () => {
    refCreate.current && refCreate.current.show();
  };

  return (
    <Background>
      <View
        style={{
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 30,
        }}>
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
            <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
              {auth.full_name}
            </Text>
          </View>
          <TouchableWithoutFeedback onPress={showCreateRoom}>
            <Image
              source={require('../../assets/images/edit.png')}
              style={{
                width: 24,
                height: 24,
                resizeMode: 'stretch',
                marginRight: 15,
              }}
              tintColor="white"
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              goBack(navigation);
            }}>
            <Image
              source={require('../../assets/images/logout.png')}
              style={{
                width: 24,
                height: 24,
                resizeMode: 'stretch',
              }}
              tintColor="white"
            />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            height: 50,
            paddingHorizontal: 5,
            // paddingVertical: 6,
          }}>
          <View
            style={{
              backgroundColor: '#f7f5f6',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 22,

              borderBottomWidth: 2,
              borderRightWidth: 2,
              borderLeftWidth: 1,
              borderLeftColor: '#ddd',
              borderRightColor: '#888',
              borderBottomColor: '#888',
            }}>
            <Image
              source={require('../../assets/images/search.png')}
              style={{
                width: 16,
                height: 16,
                marginLeft: 15,
              }}
            />
            <InputTimeout
              style={{
                flex: 1,
                padding: 0,
                paddingLeft: 10,
                height: 40,
              }}
              placeholder="Tìm kiếm"
              autoCorrect={false}
            />
          </View>
        </View>
        {/* <View
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
      </View> */}

        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopRightRadius: 30,
            marginTop: 10,
            paddingTop: 20,
            paddingLeft: 15,
            paddingRight: 15,

            borderBottomWidth: 4,
            borderRightWidth: 4,
            borderLeftWidth: 1,
            borderLeftColor: '#ddd',
            borderRightColor: '#888',
            borderBottomColor: '#888',
          }}>
          <FlatList
            // onScroll={onScroll}
            style={{height: height - 160, marginTop: -5}}
            showsVerticalScrollIndicator={false}
            key={item => item.id}
            renderItem={({item, key}) => (
              <View
                style={{
                  padding: 2,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ddd',
                }}
                >
                <TouchableHighlight
                  key={key}
                  underlayColor="#ccc"
                  delayPressIn={50}
                  onPress={selectRoom(item)}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 85,
                      alignItems: 'center',
                      paddingTop: 2,
                      paddingBottom: 2,
                    }}>
                    <View>
                      <Avatar source={{uri: getImg(item.avatar)}}></Avatar>
                    </View>
                    <View style={{paddingLeft: 15, flex: 1}}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={{fontWeight: '500', color: '#555'}}>
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            backgroundColor: '#64BEE1',
                            color: 'white',
                            fontWeight: '500',
                            borderRadius: 20,
                            fontSize: 10,
                            paddingRight: 4,
                            paddingLeft: 5,
                            alignSelf: 'center',
                            fontWeight: 'bold',
                          }}>
                          {1}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{marginTop: 5, fontSize: 12, color: '#999'}}>
                          {item.lastMessage?.content}
                        </Text>
                        <Text
                          style={{marginTop: 5, fontSize: 12, color: '#999'}}>
                          {item?.lastMessage?.createdAt?.fromNow()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            )}
            data={listRoom}></FlatList>
        </View>
      </View>
      <ModalCreate ref={refCreate} />
    </Background>
  );
};

export default connect(
  ({socket: {listRoom}, auth: {auth}}) => ({listRoom, auth}),
  ({
    socket: {connect, getAllUser, getListMessage, updateData},
    navigation: {goBack},
  }) => ({
    connect,
    getAllUser,
    getListMessage,
    updateData,
    goBack,
  }),
)(withNavigation(Home));
