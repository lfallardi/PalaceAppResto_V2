import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Login from './src/Login';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import WelcomeScreen from './src/Welcome';
import { Icon } from 'react-native-elements';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Login styles={[styles.LoginInput, styles.btnLogin]} navigation={this.props.navigation}/>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {header: null},
  },
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      headerTintColor: '#FFF',
      headerStyle: {
        backgroundColor: '#000',
      }      
    }
    // navigationOptions: {header: null},
  },
}, {initialRouteName: 'Home'});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  LoginInput: {
    margin: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#259D97',
  }
  
});

export default createAppContainer(AppNavigator);
