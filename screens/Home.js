import { View, Text, StyleSheet, Image, Pressable, Alert, SafeAreaView, SectionList } from 'react-native'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import Filters from '../components/Filters';
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories, } from "../database";
import { getSectionListData, useUpdateEffect } from "../utils/utils";
import debounce from "lodash.debounce";
import { Searchbar } from "react-native-paper";
import { useFonts } from '@expo-google-fonts/karla';

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ["starters", "mains", "desserts", "Drinks"];

const Item = ({ name, price, description, image }) => (
  <View style={styles.item}>
    <View style={styles.itemBody}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
    <Image
      style={styles.itemImage}
      source={{
        uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
      }}
    />
  </View>
);

export default function Home({ navigation }) {  
  const [searchBarText, setSearchBarText] = useState("");
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  const renderItems = ({ item }) => (
    <Item
      name={item.name}
      price={item.price}
      description={item.description}
      image={item.image}
    />
  );

  const [fontsLoaded] = useFonts({
    'Karla': require('../Fonts/LittleLemon_fonts/Fonts/Karla-Regular.ttf'),
    'Markazi': require('../Fonts/LittleLemon_fonts/Fonts/MarkaziText-Regular.ttf'),
  }); 

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

  const fetchData = async () => {
    const response = await fetch(API_URL);
    const result = await response.json();
    const items = result.menu.map(value => ({ ...value }));
    return items;
  }

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
        const getProfile = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(getProfile));
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback(q => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = text => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async index => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerImgageContainer}>
        <Image style={styles.headerImage} source={require('../assets/Logo.png')} />
        <Pressable
          style={styles.avatar}
          onPress={() => navigation.navigate("Profile")}
        >
          {profile?.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
                {profile?.firstName && Array.from(profile.firstName)[0]}
                {profile?.lastName && Array.from(profile.lastName)[0]}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.logo}>Little Lemon</Text>
        <Text style={styles.logoSub}>Chicago</Text>
        <View style={styles.imageContainer}>
          <Text style={styles.detail}>We are a family owned Mediterranean resturant, focused on traditional recipes served with a modern twist.</Text>
          <Image
            style={styles.logoImage}
            source={require('../assets/HeroImage.png')} />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor="#333333"
          inputStyle={{ color: "#333333" }}
        />
      </View>
      <View style={styles.orderContainer}>
        <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>
      </View>
      <View style={styles.filterContainer}>
        <Filters
          selections={filterSelections}
          onChange={handleFiltersChange}
          sections={sections}
        />
      </View>
      <View style={styles.menuContainer}>
        <SectionList
          style={styles.sectionList}
          sections={data}
          keyExtractor={item => item.id}
          renderItem={renderItems}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  headerContainer: {
    paddingLeft: 10,
    backgroundColor: '#495E57',
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
  logo: {
    fontSize: 55,
    color: '#F4CE14',
    fontFamily: 'Markazi',
    height: 53,
  },
  avatar: {
    flex: 1,
    position: "absolute",
    right: 10,
    top: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarEmpty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#495E57",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: 'Markazi',
  },
  searchBar: {
    marginTop: 10,
    backgroundColor: "#EEEEEE",
    marginBottom: 10,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 12,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  logoSub: {
    fontSize: 35,
    color: '#EEEEEE',
    fontFamily: 'Markazi',
    width: '60%',
  },
  detail: {
    color: '#EEEEEE',
    fontSize: 16,
    fontFamily: 'Karla',
    paddingTop: 12,
    width: '60%',
  },
  logoImage: {
    width: 120,
    height: 130,
    borderRadius: 12,
  },
  orderContainer: {
    backgroundColor: '#EEEEEE',
    paddingLeft: 10,
    paddingTop: 20,
  },
  delivery: {
    fontSize: 18,
    fontFamily: "Karla",
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e4e4e4',
    borderRadius: 17,
    marginRight: 15,
  },
  filterButtonText: {
    fontFamily: 'Karla',
    color: '#495e57',
    fontWeight: 'bold',
    fontSize: 14,
  },
  filterContainer: {
    backgroundColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 7,
  },
  sectionList: {
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#495e57",
    backgroundColor: "#EEEEEE",
    fontFamily: "Karla",
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    color: "#000000",
    paddingBottom: 5,
    fontFamily: "Karla",
    fontWeight: 'bold',
  },
  description: {
    color: "#495e57",
    paddingRight: 5,
    fontFamily: "Karla",
  },
  price: {
    fontSize: 20,
    color: "#495E57",
    paddingTop: 5,
    fontFamily: "Karla",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
});

