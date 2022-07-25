import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {refModal} from '../..';
import Avatar from '../../components/Avatar';
import ButtonShadow from '../../components/ButtonShadow';
import InputTimeout from '../../components/InputTimeout';
import {getImg} from '../../utils/common';

const screen = Dimensions.get('screen');

const ModalCreate = ({createRoom, listAllUser}, ref) => {
  const [state, _setState] = useState({
    visible: false,
    searchText: '',
    listSelect: [],
  });
  console.log(listAllUser, 'listAllUser');
  const setState = data => {
    _setState(pre => ({...pre, ...data}));
  };
  useImperativeHandle(ref, () => ({
    show: () => {
      setState({visible: true});
    },
  }));

  const onCancel = () => {
    setState({visible: false});
  };

  const onOk = () => {
    if (state.listSelect?.length === 0) {
      refModal.current &&
        refModal.current.show({
          type: 'error',
          content: 'Bạn chưa chọn thành viên nào',
        });
      return;
    }

    createRoom(state.listSelect.map(i => i.id)).then(res => {
      setState({visible: false});
    });
  };

  const clickAdd = data => () => {
    if (!state.listSelect.includes(data))
      setState({listSelect: [...state.listSelect, data]});
  };

  const clickRemove = data => () => {
    setState({
      listSelect: state.listSelect.filter(i => i.id != data?.id),
    });
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
        <View
          style={{
            width: (screen.width * 4) / 5,
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 20,
            elevation: 20,
          }}>
          <View
            style={{
              alignItems: 'center',
              paddingBottom: 10,
            }}>
            <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>
              Cuộc trò chuyện mới
            </Text>
          </View>

          <View
            style={{
              height: 50,
              paddingHorizontal: 5,
              //   borderWidth: 1,
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
                  height: 35,
                }}
                placeholder="Tìm kiếm"
                autoCorrect={false}
                onChangeText={searchText => setState({searchText})}
              />
            </View>
          </View>

          <FlatList
            horizontal
            style={{
              minHeight: 80,
              maxHeight: 100,
              marginTop: 0,
              borderBottomWidth: 1,
              borderColor: '#ddd',
            }}
            showsVerticalScrollIndicator={false}
            data={state.listSelect}
            renderItem={({item, index}) => (
              <View
                key={index}
                style={{
                  alignItems: 'center',
                  paddingTop: 2,
                  paddingBottom: 2,
                  borderBottomColor: '#ddd',
                  width: 70,
                }}>
                <View>
                  <Avatar
                    size={40}
                    source={{uri: getImg(item.avatar)}}></Avatar>
                </View>
                <TouchableWithoutFeedback
                  style={{borderWidth: 1}}
                  onPress={clickRemove(item)}>
                  <View
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 0,
                      borderWidth: 1,
                      borderColor: '#666',
                      borderRadius: 12,
                    }}>
                    <Image
                      source={require('../../assets/images/close.png')}
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderWidth: 1,
                      }}></Image>
                  </View>
                </TouchableWithoutFeedback>
                <View style={{paddingLeft: 5, flex: 1}}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 12,
                        color: '#555',
                      }}>
                      {item.fullName || '?'}
                    </Text>
                  </View>
                </View>
              </View>
            )}></FlatList>

          <FlatList
            style={{
              height: 300,
              marginTop: 5,
              borderLeftWidth: 3,
              paddingHorizontal: 16,
              borderColor: '#ccc',
            }}
            showsVerticalScrollIndicator={false}
            data={listAllUser.filter(
              i =>
                i.fullName
                  ?.toLowerCase()
                  ?.indexOf(state.searchText?.toLowerCase()) !== -1,
            )}
            renderItem={({item, index}) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    height: 55,
                    alignItems: 'center',
                    paddingHorizontal: 5,
                    paddingTop: 2,
                    paddingBottom: 2,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                  }}>
                  <View>
                    <Avatar
                      size={40}
                      source={{uri: getImg(item.avatar)}}></Avatar>
                  </View>
                  <View style={{paddingLeft: 15, flex: 1}}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontWeight: '500', color: '#555'}}>
                        {item.fullName || '?'}
                      </Text>

                      <TouchableWithoutFeedback onPress={clickAdd(item)}>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: '#666',
                            borderRadius: 12,
                          }}>
                          <Image
                            source={require('../../assets/images/close.png')}
                            style={{
                              transform: [{rotate: '45deg'}],
                              width: 20,
                              height: 20,
                              backgroundColor: state.listSelect.includes(item)
                                ? '#ccc'
                                : '#64BEE1',
                              right: 0,
                              top: 0,
                              borderRadius: 10,
                              borderWidth: 1,
                            }}
                            tintColor="white"></Image>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                </View>
              );
            }}></FlatList>

          <View
            style={{
              //   paddingTop: 10,
              alignItems: 'center',
              display: 'flex',
            }}>
            {/* <Image
              source={source}
              style={{
                width: 100,
                height: 100,
                // backgroundColor: 'red',
                resizeMode: 'stretch',
              }}
            /> */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignSelf: 'stretch',
                paddingVertical: 8,
              }}>
              <ButtonShadow
                style={{width: '40%', backgroundColor: '#f5f5f5'}}
                styleText={{color: 'black'}}
                onClick={onCancel}>
                Hủy
              </ButtonShadow>
              <ButtonShadow
                style={{width: '40%', backgroundColor: '#01A601'}}
                onClick={onOk}>
                Tạo mới
              </ButtonShadow>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default connect(
  ({socket: {listAllUser}}) => ({listAllUser}),
  ({socket: {createRoom}}) => ({createRoom}),
  null,
  {forwardRef: true},
)(forwardRef(ModalCreate));
