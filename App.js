import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './screens/Onboarding';
import { Image, AvtivityIndicator } from 'react-native';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Splash from './screens/Splash';


      const Stack = createNativeStackNavigator();

      const App = () => {      
      const [ isLoading, setIsLoading ] = React.useState(true);
      const [ isOnboardingCompleted, setIsBoardingCompleted ] = React.useState(true);
      const [userToken, setUserToken] = React.useState(null);

      const getUserToken = async () => {
        // testing purposes
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        try {
          // custom logic
          await sleep(2000);
          const token = null;
          setUserToken(token);
        } finally {
          setIsLoading(false);
        }
      };

      React.useEffect(() => {
        getUserToken();
      }, []);

        if (isLoading) {
          return <Splash/>;
        }

        return (
          <NavigationContainer>            
              <Stack.Navigator > 
                {userToken == null ? (              
                <Stack.Screen 
                  name = "Home" 
                  component={ Home }
                  options={{ 
                      headerTitle: () => (
                        <Image style={{ width: 200, height: 55, margin: 10 }} source={require("./assets/Logo.png")}/>                        
                      ), 
                      headerRight: () => (
                        <Image style={{ width: 40, height: 40, borderRadius: 50 }} source={require("./assets/Profile2.png")}/>
                      ),                        
                      
                      headerTitleAlign: 'center',
                      headerStyle: {
                        backgroundColor: '#EDEFEE'
                      } 
                    }}                     
                    />
                ) : (
                <Stack.Screen 
                  name = "Onboarding" 
                  component={ Onboarding }
                  options={{ 
                      headerTitle: () => (
                        <Image style={{ width: 200, height: 55, margin: 10 }} source={require("./assets/Logo.png")}/>
                      ), 
                      headerTitleAlign: 'center',
                      headerStyle: {
                        backgroundColor: '#EDEFEE'                        
                      }                      
                    }} />
                )}
                <Stack.Screen 
                  name = "Profile" 
                  component={ Profile }
                  options={{ 
                      headerTitle: () => (
                        <Image style={{ width: 200, height: 55, margin: 10 }} source={require("./assets/Logo.png")}/>                        
                      ), 
                      headerRight: () => (
                        <Image style={{ width: 40, height: 40, borderRadius: 50 }} source={require("./assets/Profile2.png")}/>
                      ),                        
                      
                      headerTitleAlign: 'center',
                      headerStyle: {
                        backgroundColor: '#EDEFEE'
                      } 
                    }}                     
                    /> 
                   <Stack.Screen 
                  name = "Onboarding" 
                  component={ Onboarding }
                  options={{ 
                      headerTitle: () => (
                        <Image style={{ width: 200, height: 55, margin: 10 }} source={require("./assets/Logo.png")}/>
                      ), 
                      headerTitleAlign: 'center',
                      headerStyle: {
                        backgroundColor: '#EDEFEE'                        
                      }                      
                    }} /> 
                                       
              </Stack.Navigator>              
            </NavigationContainer>
        );
      }
    
export default App;