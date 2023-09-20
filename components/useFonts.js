import * as Font from 'expo-font';

const useFonts = async () => {
  await Font.loadAsync({
    'Karla': require('../Fonts/LittleLemon_fonts/Fonts/Karla-Regular.ttf'),
    'Markazi': require('../Fonts/LittleLemon_fonts/Fonts/MarkaziText-Regular.ttf'),  });
};

export default useFonts;
