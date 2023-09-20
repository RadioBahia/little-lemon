import { View, Text, StyleSheet, Image, Pressable, TextInput, ScrollView, Alert, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import CheckBox from 'expo-checkbox';
import React, { useState, useEffect,useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { AuthContext } from '../components/AuthContext';


const Profile = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext); 
  const { update } = useContext(AuthContext);
  const [isOrder, setOrder] = useState(false);
  const [isPassword, setPassword] = useState(false);
  const [isSpecial, setSpecial] = useState(false);
  const [isNewsletter, setNewsletter] = useState(false);
  const [maskedValue, setMaskedValue] = useState("");
  const [unMaskedValue, setUnmaskedValue] = useState("");  
  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [discard, setDiscard] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const getProfile = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(getProfile));
        setDiscard(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [discard]);

  const validateName = name => {
    if (name.length > 0) {
      return name.match(/[^a-zA-Z]/);
    } else {
      return true;
    }
  };  

  const clearData = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('Onboarding');

    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = (key, value) => {
    setProfile(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    getName();
  }, []);

  const getName = () => {
    try {
      AsyncStorage.getItem('FirstName')
        .then(value => {
          if (value != null) {
            setFirstName(value);
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getLastName();
  }, []);

  const getLastName = () => {
    try {
      AsyncStorage.getItem('LastName')
        .then(value => {
          if (value != null) {
            setFirstName(value);
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMail();
  }, []);

  const getMail = () => {
    try {
      AsyncStorage.getItem('Email')
        .then(value => {
          if (value != null) {
            setEmail(value);
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspec: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile(prevState => ({
        ...prevState,
        ["image"]: result.assets[0].uri,
      }));
    }
  };

  const removeImage = () => {
    setProfile(prevState => ({
      ...prevState,
      ["image"]: "",
    }));
  };

  const getFirstLetter = ({ firstName }) => {
    return { firstName } ? { firstName }.charAt(0).toUpperCase() + '.' : '';
  };

  return (
   <KeyboardAvoidingView style={styles.container}>
    
      <View style={styles.headerImgageContainer}>
        <Image style={styles.headerImage} source={require('../assets/Logo.png')} />
        <Pressable
          style={styles.avatarHeader}
          onPress={() => navigation.navigate("OnBoarding")}
        >
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarRightHeader}>
              <Text style={styles.avatarEmptyText}>
                {profile?.firstName && Array.from(profile.firstName)[0]}
                {profile?.lastName && Array.from(profile.lastName)[0]}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      <ScrollView style={styles.container}>
      <Text style={styles.header}>Personal information</Text>
      <Text style={styles.avatar}>Avatar</Text>
      <View style={styles.headerContainer}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
                {profile.firstName && Array.from(profile.firstName)[0]}
                {profile.lastName && Array.from(profile.lastName)[0]}
              </Text>
            </View>
          )}
        <Pressable
          onPress={pickImage}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#495E57' : '#EDEFEE',
            },
            styles.changeButton,
          ]}>

          <Text style={styles.changeText}>Change</Text>
        </Pressable>
        <Pressable
          onPress={removeImage}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#495E57' : '#EDEFEE',
            },
            styles.removeButton,
          ]}>
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      </View>
      <Text style={[styles.nameText, !validateName(profile.firstName) ? "" : styles.error,]}>First name</Text>
      <TextInput
        style={styles.inputBox}
        onChangeText={setFirstName}
        value={profile.firstName}
      />
      <Text style={[styles.nameText, !validateName(profile.lastName) ? "" : styles.error,]}>Last name</Text>
      <TextInput
        style={styles.inputBox}
        onChangeText={setLastName}
        value={profile.lastName}
      />
      <Text style={styles.nameText}>Email</Text>
      <TextInput
        style={styles.inputBox}
        onChangeText={setEmail}
        value={profile.email}
        keyboardType='email-address'
      />
      <Text style={styles.nameText}>Phone number</Text>
      <MaskedTextInput
        mask='(+01) 999-999-9999'
        style={styles.inputBox}
        value={profile.phoneNumber}
        onChangeText={(text, rawText) => {
          setMaskedValue(text);
          setUnmaskedValue(rawText);
        }}
        keyboardType='phone-pad'
      />
      <Text style={styles.emailText}>Email notifications</Text>
      <View style={styles.checkSection}>
        <CheckBox
          value={isOrder}
          onValueChange={setOrder}
          style={styles.checkBox}
          color={isOrder ? '#495e57' : undefined}
        />
        <Text style={styles.checkText}>Order Statuses</Text>
      </View>

      <View style={styles.checkSection}>
        <CheckBox
          value={isPassword}
          onValueChange={setPassword}
          style={styles.checkBox}
          color={isPassword ? '#495e57' : undefined}
        />
        <Text style={styles.checkText}>Password Changes</Text>
      </View>

      <View style={styles.checkSection}>
        <CheckBox
          value={isSpecial}
          onValueChange={setSpecial}
          style={styles.checkBox}
          color={isSpecial ? '#495e57' : undefined}
        />
        <Text style={styles.checkText}>Special Offers</Text>
      </View>

      <View style={styles.checkSection}>
        <CheckBox
          value={isNewsletter}
          onValueChange={setNewsletter}
          style={styles.checkBox}
          color={isNewsletter ? '#495e57' : undefined}
        />
        <Text style={styles.checkText}>Newsletter</Text>
      </View>

      <Pressable
        onPress={() => {signOut()}}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#EDEFFE' : '#F4CE14',
          },
          styles.logOutButton,
        ]}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>

      <View style={styles.discardSection}>
        <Pressable
          onPress={() => setDiscard(true)}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#495E57' : '#EDEFEE',
            },
            styles.discardButton,
          ]}>
          <Text style={styles.removeText}>Discard changes</Text>
        </Pressable>
        <Pressable
          onPress={() => update(profile)}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#495E57' : '#EDEFEE',
            },
            styles.saveButton,
          ]}>
          <Text style={styles.removeText}>Save changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  headerImage: {
    width: 200,
    height: 50,
  },
  headerImgageContainer: {
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 10,
    paddingTop: 20,
    color: '#333333',
  },
  avatarHeader: {
    flex: 1,
    position: "absolute",
    right: 10,
    top: 10,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarEmpty: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#495E57",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  avatarRightHeader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#495E57",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: 'Markazi',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 10,
  },
  avatar: {
    fontSize: 10,
    fontWeight: '500',
    paddingLeft: 10,
    paddingTop: 10,
    color: '#495E57',
    paddingBottom: 5,
  },
  changeButton: {
    borderWidth: 2,
    width: '25%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 10,
    alignItems: 'center',
    borderColor: '#495E57',

  },
  changeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#495E57',
  },
  headerContainer: {
    alignContent: 'center',
    flexDirection: 'row',
  },
  removeButton: {
    borderWidth: 2,
    width: '25%',
    height: 50,
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 10,
    alignItems: 'center',
    borderColor: '#495E57',
  },
  removeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#495E57',
  },
  nameText: {
    fontSize: 12,
    fontWeight: '500',
    paddingLeft: 10,
    paddingTop: 20,
    color: '#495E57',
    paddingBottom: 5,
  },
  inputBox: {
    borderWidth: 1,
    width: '95%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontWeight: '400',
  },
  emailText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 20,
  },
  checkBox: {
    marginLeft: 15,

  },
  checkText: {
    fontSize: 12,
    marginLeft: 10,
    fontWeight: "500",
    color: '#495E57',
  },
  checkSection: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,

  },
  logOutButton: {
    borderWidth: 2,
    width: '95%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    alignItems: 'center',

    borderColor: '#F4CE14',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
    color: 'black',
  },
  discardButton: {
    borderWidth: 2,
    width: '40%',
    height: 45,
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
    borderColor: '#495E57',
    borderRadius: 10,
  },
  discardSection: {
    flexDirection: 'row',
  },
  saveButton: {
    borderWidth: 2,
    width: '40%',
    height: 45,
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
    borderColor: '#495E57',
    borderRadius: 10,
  }
}) 