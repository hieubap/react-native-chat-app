import accountProvider from '@data-access/account-provider';
import fileProvider from '@data-access/file-provider';
import messageProvider from '@data-access/message-provider';
import roomProvider from '@data-access/room-provider';
import clientUtils, {UrlServer} from '@utils/client-utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getImg} from '@utils/common';
import {createRef} from 'react';
import {imgDefault} from '../../../variable';
import {actionDevice, actionPublic, actionUser} from './action';
// import SockJS from 'sockjs-client';
const SockJS = require('sockjs-client/dist/sockjs');
const Stomp = require('stomp-websocket');
// import { message } from "antd";

const refTimeout = createRef();

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  state:
    // {
    //   stompClient: null,

    //   listRoom: [],
    //   listMessage: [],
    //   listLastSeen: [],
    //   listAllUser: [],
    //   currentRoomId: null,
    // },
    (() => {
      try {
        let data = {
          stompClient: null,

          listRoom: [],
          listMessage: [],
          listLastSeen: [],
          listAllUser: [],
          currentRoomId: null,
        };
        // if (data) {
        //   const parseData = JSON.parse(data);
        //   clientUtils.auth = 'Bearer ' + parseData.token;
        //   clientUtils.token = parseData.token;
        //   return parseData;
        // }
        return {
          stompClient: null,

          listRoom: [],
          listMessage: [],
          listLastSeen: [],
          listAllUser: [],
          currentRoomId: null,
        };
      } catch (error) {
        console.log(error);
      }
      return {
        stompClient: null,

        listRoom: [],
        listMessage: [],
        listLastSeen: [],
        listAllUser: [],
        currentRoomId: null,
      };
    })(),

  reducers: {
    updateData(state, payload = {}) {
      // AsyncStorage.setItem(`_store_chat`, {...state, ...payload});
      return {...state, ...payload};
    },
  },
  effects: dispatch => ({
    connect: (payload = {}, state) => {
      var stompClient = null;
      var socket = null;
      const {userId = 1, deviceInfoId} = state.auth?.auth || {};

      function connect() {
        socket = new SockJS(`${UrlServer()}/ws`); // api/v1
        stompClient = Stomp.over(socket);
        stompClient.connect(
          {
            token: clientUtils.token,
          },
          stompSuccess,
          stompFailure,
        );
        dispatch.socket.updateData({stompClient});
      }

      const stompSuccess = frame => {
        console.log(frame, 'frame');
        // AsyncStorage.setItem('auth', {
        //   userId: 1,
        //   avatar:
        //     'https://scontent.fhan3-5.fna.fbcdn.net/v/t39.30808-6/277585198_1576678479399787_4155074655708359256_n.jpg?_nc_cat=109&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=xUpBowVSwtQAX9CLEoM&tn=PBmWd8efRebvWDfN&_nc_ht=scontent.fhan3-5.fna&oh=00_AT_tJDVixW7mJfn5aMpLST4SAWt1LTwcKpBckKdcZ4hhSQ&oe=627C9B32',
        // });
        // AsyncStorage.clear();
        if (userId) {
          stompClient.subscribe('/broker/public', actionPublic(dispatch));
          stompClient.subscribe(
            '/broker/user/' + userId,
            actionUser(dispatch, state),
          );
          stompClient.subscribe(
            '/broker/device/' + deviceInfoId,
            actionDevice(dispatch),
          );

          stompClient.send('/app/list.room.' + userId, {}, {});
        }
      };

      function stompFailure(error) {
        // toast.error('Hệ thống đang bảo trì. Xin vui lòng chờ ...');
      }

      connect();
    },
    createRoom: (_, {auth: {auth}}) => {
      roomProvider.post({adminId: auth?.userId}).then(res => {
        if (res && res.code === 0) {
          dispatch.socket.updateListRoom(res.data);
        }
      });
    },
    getAllUser: _ => {
      accountProvider.search({page: 0, size: 99}).then(res => {
        if (res && res.code === 0) {
          dispatch.socket.updateData({listAllUser: res.data});
        }
      });
    },
    addUser: (userId, {socket: {currentRoomId}}) => {
      roomProvider.addUser(userId, currentRoomId).then(res => {
        if (res && res.code === 0) {
          //   dispatch.socket.updateData({ listAllUser: res.data });
        }
      });
    },
    updateListRoom: ({newRoom, isNew}, {auth: {auth}, ...state}) => {
      const {listRoom} = state.socket;
      let newList = [...listRoom];

      if (isNew) {
        const indexRoom = newList.findIndex(item => item.id === newRoom.id);
        if (indexRoom !== -1) {
          newList.splice(indexRoom, 1);
        }
        newList = [newRoom, ...listRoom];
      } else {
        newList = newRoom;
      }
      console.log(auth, 'auth');
      dispatch.socket.updateData({
        listRoom: newList.map(item => ({
          ...item,
          name:
            item.connectedUsers?.length === 1
              ? item.adminId === auth?.userId
                ? item.connectedUsers[0]?.fullName
                : item.admin?.fullName
              : item.connectedUsers?.length === 0
              ? 'Chỉ có bạn'
              : 'Nhóm ' + item.id,
          avatar:
            item.connectedUsers?.length === 1
              ? item.adminId === auth?.userId
                ? item.connectedUsers[0]?.avatar
                : item.admin?.avatar
              : item.connectedUsers?.length === 0
              ? auth.avatar
              : imgDefault,
        })),
      });
    },
    updateListMessage: (payload, state) => {
      const {listMessage, currentRoomId} = state.socket;

      if (currentRoomId !== payload.roomId) {
        return;
      }

      dispatch.socket.updateData({
        listMessage: [...listMessage, payload],
        [`messageRoom${currentRoomId}`]: [...listMessage, payload],
      });
      dispatch.socket.scrollToBottom();
    },
    updateLastSeen: (payload, state) => {
      const {listMessage, currentRoomId} = state.socket;
      const newMessages = Object.assign([], listMessage);

      if (currentRoomId !== payload.roomId) {
        return;
      }

      const indexMessage = listMessage.findIndex(
        item => item.id === payload.messageId,
      );
      const indexRemove = listMessage.findIndex(item =>
        item.listLastSeen?.some(i => i.userId === payload.userId),
      );

      if (indexRemove !== -1) {
        const messageSeen = newMessages[indexRemove];
        messageSeen.listLastSeen = messageSeen?.listLastSeen.filter(
          i => i.userId !== payload.userId,
        );
        newMessages.splice(indexRemove, 1, messageSeen);
      }

      if (indexMessage !== -1) {
        const messageSeen = newMessages[indexMessage];
        if (!messageSeen?.listLastSeen) {
          messageSeen.listLastSeen = [payload];
        } else messageSeen?.listLastSeen.push(payload);
        newMessages.splice(indexMessage, 1, messageSeen);
      }
      dispatch.socket.updateData({listMessage: [...newMessages]});
    },
    updateEmoji: (payload, state) => {
      const {listMessage, currentRoomId} = state.socket;
      const newMessages = Object.assign([], listMessage);

      if (currentRoomId !== payload.roomId) {
        return;
      }

      const indexMessage = listMessage.findIndex(
        item => item.id === payload.messageId,
      );

      if (indexMessage !== -1) {
        const messageEmoji = newMessages[indexMessage];
        if (messageEmoji.listEmoji) {
          messageEmoji.listEmoji = [...messageEmoji.listEmoji, payload];
        } else {
          messageEmoji.listEmoji = [payload];
        }
        newMessages.splice(indexMessage, 1, messageEmoji);
      }
      dispatch.socket.updateData({listMessage: [...newMessages]});
    },
    updateEmojiRemove: (payload, state) => {
      const {listMessage, currentRoomId} = state.socket;
      const newMessages = Object.assign([], listMessage);

      if (currentRoomId !== payload.roomId) {
        return;
      }

      const indexMessage = listMessage.findIndex(
        item => item.id === payload.messageId,
      );

      if (indexMessage !== -1) {
        const messageEmoji = newMessages[indexMessage];
        messageEmoji.listEmoji = messageEmoji.listEmoji?.filter(
          i => i.userId !== payload.userId,
        );
      }
      dispatch.socket.updateData({listMessage: [...newMessages]});
    },
    sendEmoji: (
      {type, messageId},
      {auth: {auth}, socket: {stompClient, currentRoomId}},
    ) => {
      stompClient.send(
        `/app/send.emoji`,
        {},
        JSON.stringify({
          userId: auth?.userId,
          messageId,
          type,
          roomId: currentRoomId,
        }),
      );
    },
    scrollToBottom: () => {
      // if (refTimeout.current) {
      //   clearTimeout(refTimeout.current);
      // }
      // refTimeout.current = setTimeout(() => {
      //   document
      //     .getElementById('id-content-chat-message')
      //     ?.scrollIntoView({block: 'end', behavior: 'smooth'});
      // });
    },
    getListMessage: (
      roomId,
      {
        // auth: {auth},
        socket: {currentRoomId, stompClient, listMessage, ...rest},
      },
    ) => {
      console.log(rest, 'res');
      if (rest[`messageRoom${roomId}`]) {
        dispatch.socket.updateData({
          listMessage: rest[`messageRoom${roomId}`],
        });
        setTimeout(() => {
          // dispatch.socket.scrollToBottom();
          const listMess = rest[`messageRoom${roomId}`];
          dispatch.socket.sendlastSeen({
            messageId: listMess[listMess?.length - 1]?.id,
            roomId: listMess[listMess?.length - 1]?.roomId,
          });
        }, 100);
      } else {
        console.log(roomId, 'get message');
        dispatch.socket.updateData({
          [`messageRoom${roomId}`]: [],
        });
        messageProvider
          .search({roomId, sort: 'createdAt,desc', size: 30})
          .then(res => {
            if (res && res.code === 0) {
              if (roomId === currentRoomId) {
                dispatch.socket.updateData({
                  listMessage: res.data?.reverse(),
                  [`messageRoom${roomId}`]: res.data?.reverse(),
                });
              } else
                dispatch.socket.updateData({
                  [`messageRoom${roomId}`]: res.data?.reverse(),
                });
              dispatch.socket.sendlastSeen({
                messageId: res.data[res.data?.length - 1]?.id,
                roomId: res.data[res.data?.length - 1]?.roomId,
              });
              // dispatch.socket.scrollToBottom();
            }
          });
      }
    },
    sendlastSeen: (
      {messageId, roomId},
      {auth: {auth}, socket: {stompClient, currentRoomId}},
    ) => {
      if (roomId === currentRoomId) {
        setTimeout(() => {
          stompClient?.send(
            `/app/last.seen.${auth?.userId}.${currentRoomId}.${messageId}`,
          );
        }, 3000);
      }
    },
    sendMessage: (
      {content, type} = {},
      {auth: {auth}, socket: {stompClient, currentRoomId}},
    ) => {
      if (!currentRoomId) {
        // toast.error('chưa chọn phòng');
        return;
      }
      if (!auth?.userId) {
        // toast.error('chưa đăng nhập');
        return;
      }
      stompClient?.send(
        '/app/send.message',
        {},
        JSON.stringify({
          fromId: auth?.userId,
          roomId: currentRoomId,
          content,
          type,
        }),
      );
    },
    // remove
    changeAvatar: (file, {auth: {auth}}) => {
      fileProvider
        .upload(file)
        .then(fileDetail => {
          if (fileDetail && fileDetail.code === 0) {
            dispatch.auth.updateAvatar(fileDetail?.data.filePath);
          } else {
          }
        })
        .finally(() => {});
    },
  }),
};
