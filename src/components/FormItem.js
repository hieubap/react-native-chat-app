import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form';
import {Text, TextInput, View} from 'react-native';

const validates = {
  required:
    ({message}) =>
    value =>
      value ? undefined : message,
};

const renderField = ({
  label,
  style,
  placeholder,
  secureTextEntry,
  meta: {touched, error, warning},
  input: {onChange, ...restInput},
}) => {
  return (
    <View>
      <View>
        <Text style={{marginBottom: 4, marginTop: 2}}>{label}</Text>
        <TextInput
          style={[style]}
          onChangeText={onChange}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          {...restInput}></TextInput>
      </View>
      {touched &&
        ((error && <Text style={{color: 'red'}}>{error}</Text>) ||
          (warning && <Text style={{color: 'orange'}}>{warning}</Text>))}
    </View>
  );
};

const FormItem = ({
  validate,
  name,
  placeholder,
  label,
  style,
  secureTextEntry,
}) => {
  const _validate = useMemo(
    () => validate.map(item => validates[item.key]({message: item.message})),
    [],
  );
  return (
    <Field
      validate={_validate}
      name={name}
      label={label}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      component={renderField}
      style={style}
    />
  );
};

FormItem.propTypes = {};

export default FormItem;
