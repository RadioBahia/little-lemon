import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { validateEmail } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';



const Onboarding = ({ navigation }) => {
  const [ email, onChangeEmail ] = React.useState('');
  const isEmailValid = validateEmail(email);
  const [ firstName, setFirstName ] = React.useState('');

  
  const setData = async () => {
    if (firstName.length == 0) {
      Alert.alert('Please enter First Name')  
      
    } else if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email')
    } else {
      try {
        await AsyncStorage.setItem('FirstName', firstName);
        await AsyncStorage.setItem('Email', email);
        navigation.navigate('Home');
      } catch (error) {
        console.log(error);
      } 
    }
  }

  return ( 
       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={[ {flexDirection: 'column' },]}>          
          <View style={styles.innerContainer}> 
             <Text style={styles.messageText}>Let us get to know you</Text>  
          </View>                             
          <View style={styles.infoContainer}>
              <Text style={styles.boxLabel}>First Name</Text>    
                <TextInput
                      style={styles.inputBox}
                      value={firstName}
                      onChangeText={setFirstName}
                    />

              <Text style={styles.boxLabel}>Email</Text>    
                <TextInput
                      style={styles.inputBox}
                      value={email}
                      onChangeText={onChangeEmail}             
                    />                 
            </View>                  
              
              <View style={styles.footerContainer}>         
              
              <Pressable
                style={validateEmail(email) ? styles.button : styles.disabled}
                onPress={ setData }> 
                <Text style={styles.boxLabel}>Next</Text>               
              </Pressable>                                     
            </View>                 
        </View> 
     </KeyboardAvoidingView>   
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',     
    flex: 1,                         
  },  
  innerContainer: {
    
    backgroundColor: '#EDEFEE',     
    justifyContent: 'center',
    flex: 1.8,        
  },  
  messageText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',     
    color: '#495e57',   
  },
  inputBox: {
    height: 40,
    width: 350,
    margin: 20,
    fontSize: 16,
    borderWidth: 2,
    borderRadius: 14, 
    paddingHorizontal: 15,        
  },
  boxLabel: {
    fontSize: 20,
    textAlign: 'center',
    color: '#495e57',
  },
  button: {           
    fontSize: 20,
    marginTop: 30,
    marginRight: 30,
    paddingVertical: 8,
    width: '30%',    
    backgroundColor: '#F4CE14',
    borderRadius: 10,
    textAlign: 'center',    
    paddingHorizontal: 5,
    alignSelf: 'flex-end',   
  },
  disabled: {
    fontSize: 20,    
    marginRight: 30,
    paddingVertical: 8,    
    width: '30%',    
    backgroundColor: '#BFBFBF',
    borderRadius: 10,
    textAlign: 'center',    
    paddingHorizontal: 5,
    alignSelf: 'flex-end',    
  },
  infoContainer: {
    backgroundColor: '#EDEFEE',      
    justifyContent: 'flex-start',
    flex: 3,        
  },
  footerContainer: {    
    backgroundColor: '#495E57',    
    justifyContent: 'center',     
    flex: 0.9,           
  },  
})