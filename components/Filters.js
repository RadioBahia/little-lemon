import { View, TouchableOpacity, Text, StyleSheet } from "react-native";


export default function Filters ({ onChange, selections, sections }) {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}          
          onPress={() => {
            onChange(index);            
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: "center",
            alignItems: "center",            
            paddingVertical: 10,
            backgroundColor: selections[index] ? "#495e57" : "#e4e4e4",
            borderRadius: 12, 
            marginRight: 13,           
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Karla",
                color: selections[index] ? "#edefee" : "#495e57",
                fontWeight: 'bold',
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#EEEEEE",
    flexDirection: "row",    
    marginBottom: 16,
    alignContent: 'center',   
  },
});

