import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {TextInput} from 'react-native-gesture-handler';

const InputTimeout = (
  {
    value = '',
    onChange = () => {},
    onChangeText = () => {},
    style = {},
    placeholder = '',
  },
  ref,
) => {
  const [data, setData] = useState('');
  const refTimeout = useRef('');
  const refInput = useRef();

  useImperativeHandle(ref, () => ({
    blur: () => {
      if (refInput.current) {
        refInput.current.blur();
      }
    },
    data: () => data,
    clearTime: (isSetNew, newData) => {
      if (refTimeout.current) {
        clearTimeout(refTimeout.current);
      }
      if (isSetNew) {
        setData(newData);
      }
    },
  }));
  useEffect(() => {
    if (value !== data) {
      setData(value);
    }
  }, [value]);
  const handleChange = data => {
    setData(data);
    onChange(data);
    if (refTimeout.current) {
      clearTimeout(refTimeout.current);
    }
    refTimeout.current = setTimeout(() => {
      onChangeText(data);
    }, 500);
  };
  return (
    <TextInput
      ref={refInput}
      onChangeText={handleChange}
      value={data}
      style={style}
      placeholder={placeholder}></TextInput>
  );
};

export default forwardRef(InputTimeout);
