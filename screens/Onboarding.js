import { View, Text, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, Image, Platform } from 'react-native';
import React from 'react';
import { validateEmail } from '../utils';
import Constants from 'expo-constants';
import { useFonts } from "expo-font";
import { AuthContext }  from '../components/AuthContext';

const Onboarding = ({ navigation }) => {
  const [email, onChangeEmail] = React.useState('');
  const isEmailValid = validateEmail(email);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const { signIn } = React.useContext(AuthContext);

  const [fontsLoaded] = useFonts({
    'Karla': require('../Fonts/LittleLemon_fonts/Fonts/Karla-Regular.ttf'),
    'Markazi': require('../Fonts/LittleLemon_fonts/Fonts/MarkaziText-Regular.ttf'),
  }); 
  
  const loginHandle = () => {   

    if ( firstName.length == 0 || lastName.length == 0 ) {
        Alert.alert('Wrong Input!', 'Firstname, Lastname or email fields cannot be empty.', [
            {text: 'Okay'}
        ]);   
        return;             
    } 
    if (!validateEmail(email)) {
      Alert.alert('Wrong Input!', 'Please enter a valid email' , [{text: 'Okay'}]);
      return;
     } 
     signIn({ firstName, lastName, email });
    }    

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} >
      <View style={styles.headerImgageContainer}>
        <Image style={styles.headerImage} source={require('../assets/Logo.png')} />
      </View>      
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
          <Text style={styles.boxLabel}>Last Name</Text>
          <TextInput
            style={styles.inputBox}
            value={lastName}
            onChangeText={setLastName}
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
            onPress={() => {loginHandle(firstName, lastName, email)}}>              
            <Text style={styles.boxLabel}>Next</Text>
          </Pressable>
        </View>      
    </KeyboardAvoidingView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#EDEFEE',    
    borderWidth: 1,
  },
  headerImage: {
    width: 200,
    height: 50,
  },
  headerImgageContainer: {
    justifyContent: 'center',
    paddingBottom: 10,
    alignItems: 'center',    
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  header: {
    fontSize: 18,
    fontWeight: '500',    
    paddingTop: 20,
    color: '#333333',
  },
  innerContainer: {
    backgroundColor: '#EDEFEE',
    justifyContent: 'center',
    backgroundColor: '#EDEFEE',
    flex: 1,    
  },
  messageText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#495e57',
    fontFamily: 'Markazi',
  },
  inputBox: {
    height: 40,
    marginBottom: 20,
    marginHorizontal: 15,
    fontSize: 16,
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 20,
  },
  boxLabel: {
    fontSize: 20,
    textAlign: 'center',
    color: '#495e57',
    fontFamily: 'Karla',
    fontWeight: 'bold',
  },
  button: {
    fontSize: 20,
    marginRight: 30,
    paddingVertical: 8,
    
    backgroundColor: '#F4CE14',
    borderRadius: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },
  disabled: {
    fontSize: 20,
    marginRight: 30,
    paddingVertical: 8,
   
    backgroundColor: '#BFBFBF',
    borderRadius: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },
  infoContainer: {
    backgroundColor: '#EDEFEE',
    justifyContent: 'flex-start',
    flex: 2,    
  },
  footerContainer: {
    backgroundColor: '#495E57',
    justifyContent: 'center',
    paddingVertical: 20,    
  },
})