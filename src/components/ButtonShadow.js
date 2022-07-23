import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  ViewPropTypes,
} from 'react-native';

const ButtonShadow = ({
  type,
  style,
  styleText,
  onClick = () => {},
  children,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View
        style={[
          {
            height: 40,
            backgroundColor: '#64BEE1',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 2,
            borderRightWidth: 2,
            borderColor: '#999',
          },
          style,
        ]}>
        <Text style={[{color: 'white', fontSize: 16}, styleText]}>
          {children}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ButtonShadow;
