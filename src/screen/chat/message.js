import React from 'react';
import {View, Text, Image, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {getImg} from '../../utils/common';

const screenSize = Dimensions.get('window');

const Message = ({
  maxWidth = 200,
  data,
  front,
  end,
  numberLike,
  listMessage,
  auth,
}) => {
  const listImage = data?.type === 2 ? JSON.parse(data.content) : [];

  return (
    <View
      style={{
        padding: 2,
        display: 'flex',
        flexDirection: 'row',
        ...(auth.userId === data.fromId
          ? {
              justifyContent: 'flex-end',
            }
          : {}),
      }}>
      <View
        style={{
          padding: 7,
          borderRadius: 15,
          maxWidth: (maxWidth / 10) * 8,
          ...(auth.userId === data.fromId
            ? {
                justifyContent: 'flex-end',
                backgroundColor: '#4552ff',
                borderBottomRightRadius: 0,
              }
            : {
                backgroundColor: '#f0f0f0',
                borderBottomLeftRadius: 0,
              }),
          ...(data.type === 2
            ? {borderBottomLeftRadius: 15, borderBottomRightRadius: 15}
            : {}),
        }}>
        {data.type === 1 ? (
          <Text
            style={{
              ...(auth.userId === data.fromId
                ? {
                    color: '#fff',
                  }
                : {
                    color: '#000',
                  }),
            }}>
            {data.content}
          </Text>
        ) : (
          <Image
            source={{uri: getImg(listImage[0])}}
            style={{
              width: 100,
              height: 100,
              margin: -7,
              borderRadius: 15,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default connect(({auth: {auth}}) => ({auth}))(Message);
