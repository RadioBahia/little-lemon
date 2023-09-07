import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = ({ navigation }) => {

  const [ text, setText ] = React.useState('');

  useEffect(() => {
    getData();
  }, []);
  
  const getData = () => {
    try {
        AsyncStorage.getItem('FirstName')
          .then(value => {
              if (value != null) {
                setText(value);
              }
          })          
      } catch (error) {
        console.log(error);
      }
  } 

  return (
    <View>
      <Text>Welcome { text } ! </Text>
    </View>
  )
}

export default Home