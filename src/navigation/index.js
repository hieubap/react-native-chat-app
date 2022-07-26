import {withNavigation} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import Chat from '../screen/chat';
import Home from '../screen/home';
import Login from '../screen/login';
import Splash from '../screen/splash';

const Stack = createStackNavigator();

const StackNavigation = ({}) => {
  return (
    <Stack.Navigator
      // drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName={'Splash'}
      headerMode="none">
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

export default connect(
  ({navigation: {mode}}) => ({mode}),
  // ({socket: {connect}}) => ({connect}),
)(StackNavigation);
