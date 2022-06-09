// import authProvider from "@src/data-access/auth-provider";

const typeAction = {
  LIST_ROOM: 1,
  JOIN: 2,
  WARNING: 3,
  CHAT: 4,
  EMOJI: 5,
  EMOJI_REMOVE: 6,
  LAST_SEEN: 7,
  LOGOUT_DEVICE: 8,
  COORDS_UPDATE: 9,
  SUCCESS_LOGOUT: 10,
};

export const actionUser =
  (dispatch, {auth: {auth}}) =>
  ({body}) => {
    const res = JSON.parse(body);
    if (res.type === typeAction.LIST_ROOM) {
      dispatch.socket.updateListRoom({newRoom: res.payload});
      for (let i = 0; i < res.payload?.length; i++) {
        dispatch.socket.getListMessage(res.payload[i]?.id);
      }
    } else if (res.type === typeAction.JOIN) {
      dispatch.socket.updateListRoom(res.payload);
    } else if (res.type === typeAction.WARNING) {
      // toast.error(res.payload);
    } else if (res.type === typeAction.CHAT) {
      dispatch.socket.updateListMessage(res.payload);
      dispatch.socket.sendlastSeen({
        messageId: res.payload?.id,
        roomId: res.payload?.roomId,
      });
    } else if (res.type === typeAction.EMOJI) {
      dispatch.socket.updateEmoji(res.payload);
    } else if (res.type === typeAction.EMOJI_REMOVE) {
      dispatch.socket.updateEmojiRemove(res.payload);
    } else if (res.type === typeAction.LAST_SEEN) {
      dispatch.socket.updateLastSeen(res.payload);
    }
    console.log('received body user: ', res);
  };

export const actionPublic =
  dispatch =>
  ({body}) => {
    const res = JSON.parse(body);
    if (res.type === typeAction.COORDS_UPDATE) {
    }
    console.log('received body: ', res);
  };

export const actionDevice =
  dispatch =>
  ({body = '{}'}) => {
    const res = JSON.parse(body);
    if (res.type === typeAction.LOGOUT_DEVICE) {
      // toast.error(
      //   "Tài khoản của bạn đã bị đăng xuất khỏi thiết bị. hệ thống sẽ tự động logout sau 5s"
      // );
      // authProvider.logout(5000);
    } else if (res.type === typeAction.WARNING) {
      // toast.error(res.payload);
    } else if (res.type === typeAction.SUCCESS_LOGOUT) {
      // toast.success("Đăng xuất thiết bị thành công");
      dispatch.deviceInfo.logoutDevice(res.payload);
    }
    console.log('received body device: ', res);
  };
