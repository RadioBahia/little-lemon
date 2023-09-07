import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Splash = () => {
  return (
    <SafeAreaView style={styles.constainer}>      
        <Image 
            style={styles.logo}
            source={require('../assets/Logo.png')} />     
          <ActivityIndicator size='large'/>
    </SafeAreaView>
    
  )
}

export default Splash

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
                
    },
    logo: {
        width: '80%',
        height: 100,
        alignSelf: 'center',
        resizeMode: 'contain',
    }    
    
})
    