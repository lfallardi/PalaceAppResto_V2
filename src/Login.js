import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, TextInput, View, Button, Image, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native'
import logo from '../assets/logo.png'
import { useDispatch, useSelector } from "react-redux"
import { login } from './actions'

// const useReduxSelector = () =>
//   useSelector(state => ({
//     isLoading: state.loginReducer.isLoading,
//     isAuthenticated: state.loginReducer.isAuthenticated
//   }));


const Login=(props) => {
  //const[LoginOK, setLoginOK] = useState(false)

  // const { isAuthenticated } = useReduxSelector()

  // useEffect(() => { 
  //   if (isAuthenticated) {
  //     props.navigation.navigate('Welcome', {Room, Name, LastName})
  //   }
  //  }, [isAuthenticated])

  const dispatch = useDispatch()

  const handlePress = () => {
    if (Room == "" || Name == "" || LastName == "") {
      Alert.alert('The Grand at Moon Palace', 'Login Failed')
    } else {
      dispatch(login())
      props.navigation.navigate('Welcome', {Room, Name, LastName})
    }
    
  }

  const [ LoginInput, btnLogin ] = props.styles

  const [Room, setRoom] = useState("");
  const [Name, setName] = useState("");
  const [LastName, setLastName] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.container}>
      
        <Image source={logo} style={styles.stretch}/>
      
        <TextInput key="Room" style={LoginInput} placeholder="Room" keyboardType={'numeric'} value={Room} onChangeText={(text) => setRoom(text)}/>
        <TextInput key="Name" style={LoginInput} placeholder="Name" value={Name} onChangeText={(text) => setName(text)}/>
        <TextInput key="LastName" style={LoginInput} placeholder="Last name" value={LastName} onChangeText={(text) => setLastName(text)}/>
      
        <Button title="Login" style={btnLogin} color='#259D97' onPress={handlePress}/>
      
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 300,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },

  stretch: {
    width: 300,
    resizeMode: 'contain',
  }

})

export default Login;