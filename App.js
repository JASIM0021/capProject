import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Router from './src/router/Router'
import { NavigationContainer } from '@react-navigation/native'
import { MyProvider } from './context/GlobalContextProvider'

const App = () => {
  return (
    <NavigationContainer>
        <MyProvider>
       <Router/>
       </MyProvider>
      </NavigationContainer>
  
  )
}

export default App

const styles = StyleSheet.create({})