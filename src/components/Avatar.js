import React from 'react';
import {Image} from 'react-native';
import {imgDefault} from '../variable';

const Avatar = ({size = 60, source = {uri: imgDefault}}) => (
  <Image
    source={source}
    borderRadius={size / 2}
    style={{width: size, height: size}}
  />
);
export default Avatar;
