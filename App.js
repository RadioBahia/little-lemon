import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './screens/Onboarding';
import { Alert } from "react-native";
import Home from './screens/Home';
import Profile from './screens/Profile';
import Splash from './screens/Splash';
import { AuthContext } from './components/AuthContext';  
import { useFonts } from '@expo-google-fonts/karla';   
import AsyncStorage from '@react-native-async-storage/async-storage';

      const Stack = createNativeStackNavigator();       

      export default function App () {         
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const [fontsLoaded] = useFonts({
        'Karla': require('./Fonts/LittleLemon_fonts/Fonts/Karla-Regular.ttf'),
        'Markazi': require('./Fonts/LittleLemon_fonts/Fonts/MarkaziText-Regular.ttf'),
      }); 
      
      const initialLoginState = {
        isLoading: true, 
        isOnboardingCompleted: false,               
      };

      useEffect(() => {
        (async () => {
          let profileData = [];
          await sleep(2000);
          try {
            const getProfile = await AsyncStorage.getItem("profile");
            if (getProfile !== null) {
              profileData = getProfile;              
            }
          } catch (e) {
            console.error(e);
          } finally {
            if (Object.keys(profileData).length != 0) {
              dispatch({ type: "signIn", isOnboardingCompleted: true });
            } else {
              dispatch({ type: "signIn", isOnboardingCompleted: false });
            }
          }
        })();
      }, []);      

      const loginReducer = (prevState, action) => {
        switch( action.type ) {
          case 'signIn': 
            return {
              ...prevState,
              isOnboardingCompleted: action.isOnboardingCompleted,
              isLoading: false,
            };             
        }             
      };
    
      const [state, dispatch] = React.useReducer(loginReducer, initialLoginState);
    
      const authContext = React.useMemo(() => ({
        signIn: async data => {          
          try {
            const jsonValue = JSON.stringify(data)
            await AsyncStorage.setItem('profile', jsonValue);
          } catch(e) {
            console.log(e);
          }
          
          dispatch({ type: 'signIn', isOnboardingCompleted: true });
        },
        signOut: async() => {         
          try {
            await AsyncStorage.clear();
          } catch(e) {
            console.log(e);
          }
          dispatch({ type: 'signIn', isOnboardingCompleted: false });
        },
        update: async data => {
          try {
            const jsonValue = JSON.stringify(data);
            await AsyncStorage.setItem("profile", jsonValue);
          } catch (e) {
            console.error(e);
          }  
          Alert.alert("Success", "Successfully saved changes!");
        },
      }), []);    
      
    
      if( state.isLoading ) {
        return <Splash/>;          
      }

        return (
          <AuthContext.Provider value={authContext}>
          <NavigationContainer>            
              <Stack.Navigator > 
                {state.isOnboardingCompleted ? ( 
                  <>             
                <Stack.Screen 
                  name = "Home" 
                  component={ Home }
                  options={{ 
                      headerShown: false,
                    }}                     
                    />
                    <Stack.Screen 
                  name = "Profile" 
                  component={ Profile }
                  options={{ 
                      headerShown: false,
                    }}                     
                    /> 
                    </>
                ) : (
                <Stack.Screen 
                  name = "Onboarding" 
                  component={ Onboarding }
                  options={{ 
                      headerShown: false, 
                    }} />
                )}                 
                                       
              </Stack.Navigator>              
            </NavigationContainer>
          </AuthContext.Provider>
        );
      }
    
