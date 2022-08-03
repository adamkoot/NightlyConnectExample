import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Main from './components/Main';
import Second from './components/Second';
//import {ViewPropTypes} from 'deprecated-react-native-prop-types';
export const App = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="MAIN"
          component={Main}
          options={{tabBarStyle: {display: 'none'}}}
        />
        <Tab.Screen
          name="QR"
          component={Second}
          options={{tabBarStyle: {display: 'none'}}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
