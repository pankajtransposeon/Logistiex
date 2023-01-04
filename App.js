/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable comma-dangle */
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import {StyleSheet,View,ScrollView,ToastAndroid,Alert} from 'react-native';
import { NativeBaseProvider, Box, Text, Image, Avatar, Heading, Button, Select, Divider, Center,Icon } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './src/components/Login';
import Main from './src/components/Main';
import NewSellerPickup from './src/components/newSeller/NewSellerPickup';
import NewSellerSelection from './src/components/newSeller/NewSellerSelection';
import ShipmentBarcode from './src/components/newSeller/ShipmentBarcode';
import MapScreen from './src/components/MapScreen';
import Reject from './src/components/RejectReason';
import POD from './src/components/newSeller/POD';
import StartTrip from './src/components/StartTrip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as newseller112 from "./src/components/newSeller/NewSellerPickup";
import Lottie from 'lottie-react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';

import NetInfo from "@react-native-community/netinfo";

import axios from 'axios';

import {openDatabase} from "react-native-sqlite-storage";
const db = openDatabase({name: "rn_sqlite"});
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


function StackNavigators({navigation}){
  const [data,setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
const getData = `https://bked.logistiex.com/SellerMainScreen/sellerList/HADWFE01`;
// const userId = route.params.userId;
const userId = 'HADWFE01';

useEffect(() => {
    (async () => {
        await axios.get(getData).then((res) => {
            setData(res.data);
            console.log(res.data);
            createTables();
            toggleLoading1();
        }, (error) => {
            Alert.alert(error);
        });
    })();
}, []);

const sync11 = () => {
  NetInfo.fetch().then(state => {
      if (state.isConnected && state.isInternetReachable) {
          console.log("You are online!");
          // ToastAndroid.show('You are Online!', ToastAndroid.SHORT);
          createTables();
          //ToastAndroid.show('Adding Data to Local DB!', ToastAndroid.SHORT);
          toggleLoading();
          viewDetails();

      } else {
          console.log("You are offline!");
          ToastAndroid.show('You are Offline!', ToastAndroid.SHORT);
          console.log('Your Details from Local DB is');
          viewDetails();
      }
  });
  };
const createTables = () => {
  db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS SyncSellerPickUp', []);
      txn.executeSql(`CREATE TABLE IF NOT EXISTS SyncSellerPickUp( consignorCode ID VARCHAR(200) PRIMARY KEY ,userId VARCHAR(100), consignorName VARCHAR(200),consignorAddress VARCHAR(500),
    consignorLocation VARCHAR(200),consignorContact VARCHAR(200),ReverseDeliveries INT(20) ,PRSNumber VARCHAR(200),ForwardPickups INT(20))`, [], (sqlTxn, res) => {
          // console.log("table created successfully1212");
          // toggleLoading();
      }, error => {
          console.log("error on creating table " + error.message);
      },);
  });
};
const toggleLoading1 = () => {
  // setIsLoading(!isLoading);
  (async () => {
      await axios.get(getData).then((res) => 
      {
          setData(res.data);
          console.log("Size of data : " + res.data.length);
          for (let i = 0; i < res.data.length; i++) 
          {
              console.log(res.data[i].consignorCode);
              let m21 = JSON.stringify(res.data[i].consignorAddress, null, 4);
              db.transaction(txn => {
                  txn.executeSql(`INSERT OR REPLACE INTO SyncSellerPickUp( consignorCode ,userId ,consignorName , consignorAddress,
                  consignorLocation ,consignorContact ,ReverseDeliveries ,PRSNumber ,ForwardPickups) VALUES (?,?,?,?,?,?,?,?,?)`, [
                      res.data[i].consignorCode,
                      userId,
                      res.data[i].consignorName,
                      m21,
                      res.data[i].consignorLocation,
                      res.data[i].consignorContact,
                      res.data[i].ReverseDeliveries,
                      res.data[i].PRSNumber,
                      res.data[i].ForwardPickups,
                  ], (sqlTxn, res) => {
                      console.log(`\n Data Added to local db successfully1212`);
                      console.log(res);
                  }, error => {
                      console.log("error on adding data " + error.message);
                  },);
              });
          }
          // viewDetails();
          // setIsLoading(false);
      }, (error) => {
          Alert.alert(error);
      });
  })();
};
const toggleLoading = () => {
  setIsLoading(!isLoading);
  (async () => {
      await axios.get(getData).then((res) => 
      {
          setData(res.data);
          console.log("Size of data : " + res.data.length);
          for (let i = 0; i < res.data.length; i++) 
          {
              console.log(res.data[i].consignorCode);
              let m21 = JSON.stringify(res.data[i].consignorAddress, null, 4);
              db.transaction(txn => {
                  txn.executeSql(`INSERT OR REPLACE INTO SyncSellerPickUp( consignorCode ,userId ,consignorName , consignorAddress,
                  consignorLocation ,consignorContact ,ReverseDeliveries ,PRSNumber ,ForwardPickups) VALUES (?,?,?,?,?,?,?,?,?)`, [
                      res.data[i].consignorCode,
                      userId,
                      res.data[i].consignorName,
                      m21,
                      res.data[i].consignorLocation,
                      res.data[i].consignorContact,
                      res.data[i].ReverseDeliveries,
                      res.data[i].PRSNumber,
                      res.data[i].ForwardPickups,
                  ], (sqlTxn, res) => {
                      console.log(`\n Data Added to local db successfully1212`);
                      console.log(res);
                  }, error => {
                      console.log("error on adding data " + error.message);
                  },);
              });
          }
          // viewDetails();
          setIsLoading(false);
      }, (error) => {
          Alert.alert(error);
      });
  })();
};

  const viewDetails = () => {
    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => {
            let temp = [];
            console.log(results.rows.length);
            for (let i = 0; i < results.rows.length; ++ i) {
                temp.push(results.rows.item(i));
                console.log(results.rows.item(i).consignorName);
                var address121 = results.rows.item(i).consignorAddress;
                var address_json = JSON.parse(address121);
                // console.log(typeof (address_json));
                console.log("Address from local db : " + address_json.consignorAddress1 + " " + address_json.consignorAddress2);
                // ToastAndroid.show('consignorName:' + results.rows.item(i).consignorName + "\n" + 'PRSNumber : ' + results.rows.item(i).PRSNumber, ToastAndroid.SHORT);
            }
            
            ToastAndroid.show("Sync Successful",ToastAndroid.SHORT);
            console.log("Data from Local Database : \n ", JSON.stringify(temp, null, 4));
        });
    });
};

// // setIsLoading ? navigation.navigate('loading1') : null;
// // setTimeout(() => 
// // {
// //     setIsLoading(false);
// //     // navigation.navigate('NewSellerPickup');
// // }, 4000);
  return(
    <NativeBaseProvider>
    <Stack.Navigator initialRouteName={'Login'} screenOptions={{
      headerStyle: {
        backgroundColor: "#004aad",
        // elevation: 0,
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontWeight: 'bold',
        // alignSelf: 'center',
      },
    }}>
      <Stack.Screen name="Login" component={Login}
        options={{
          header: () => null
        }} 
      />

      <Stack.Screen name="Main" component={Main}
        options={{
          headerTitle: (props) => (
            <NativeBaseProvider>
              <Heading style={{color: 'white'}} size="md">Dashboard</Heading>
            </NativeBaseProvider>
          ),
          headerLeft: () => (
            <MaterialIcons name="menu" style={{fontSize: 30, marginLeft: 10, color: 'white'}} onPress={()=>{console.log("dashboard menu clicked"), navigation.dispatch(DrawerActions.openDrawer())}} />
          ),
        }}
      />

      <Stack.Screen name="NewSellerPickup" component={NewSellerPickup}
        options={{
          headerTitle: (props) => (
            <NativeBaseProvider>
              <Heading style={{color: 'white'}} size="md">Seller Pickups</Heading>
            </NativeBaseProvider>
          ),
          headerLeft: () => (
            <MaterialIcons name="menu" style={{fontSize: 30, marginLeft: 10, color: 'white'}} onPress={()=>navigation.toggleDrawer()} />
          ),
          headerRight: () => (
            <NativeBaseProvider>
          {/* //     <Button  leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" />} > Sync</Button> */}
          <Button leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" color="white" />}onPress={() => sync11()
          
          
        
        
        
        }
           style={{
            marginTop:8.5,marginBottom:8, marginLeft: 10,marginRight:12,backgroundColor: '#004aad',width:30,height:38,alignSelf: 'center',
            borderRadius: 10,
    }}
    title="sync" name='Sync' ></Button>
           </NativeBaseProvider>
          )
        }}
      />

      <Stack.Screen name="NewSellerSelection" component={NewSellerSelection} 
        options={{
          headerTitle: (props) => (
            <NativeBaseProvider>
              <Heading style={{color: 'white'}} size="md">Seller Summary</Heading>
            </NativeBaseProvider>
          ),
          headerLeft: () => (
            <MaterialIcons name="menu" style={{fontSize: 30, marginLeft: 10, color: 'white'}} onPress={()=>navigation.toggleDrawer()} />
          ),
        }}
      />

      <Stack.Screen name="ShipmentBarcode" component={ShipmentBarcode}
        options={{
          headerTitle: (props) => (
            <NativeBaseProvider>
              <Heading style={{color: 'white'}} size="md">Scan Products</Heading>
            </NativeBaseProvider>
          ),
          headerLeft: () => (
            <MaterialIcons name="menu" style={{fontSize: 30, marginLeft: 10, color: 'white'}} onPress={()=>navigation.toggleDrawer()} />
          ),
        }}
      />

      <Stack.Screen name="MapScreen" component={MapScreen}
        options={{
          headerTitle: (props) => (
            <NativeBaseProvider>
              <Heading style={{color: 'white'}} size="md">Map Navigation</Heading>
            </NativeBaseProvider>
          ),
          headerLeft: () => (
            <MaterialIcons name="menu" style={{fontSize: 30, marginLeft: 10, color: 'white'}} onPress={()=>navigation.toggleDrawer()} />
          ),
        }}
      />

      <Stack.Screen name="reject" component={Reject} 
        options={{
          header: () => null
        }} 
      />

      <Stack.Screen name="POD" component={POD} 
        options={{
          headerTitle: (props) => (
            <NativeBaseProvider>
              <Heading style={{color: 'white'}} size="md">Pickup Summary</Heading>
            </NativeBaseProvider>
          ),
          headerLeft: () => (
            <MaterialIcons name="menu" style={{fontSize: 30, marginLeft: 10, color: 'white'}} onPress={()=>navigation.toggleDrawer()} />
          ),
        }}
      />

      <Stack.Screen name="StartTrip" component={StartTrip} 
        options={{
          headerTitle: (props) => (
            <NativeBaseProvider>
              <Heading style={{color: 'white'}} size="md">Start Trip</Heading>
            </NativeBaseProvider>
          ),
          headerLeft: () => (
            <MaterialIcons name="menu" style={{fontSize: 30, marginLeft: 10, color: 'white'}} onPress={()=>navigation.toggleDrawer()} />
          ),
        }}
      />

    </Stack.Navigator>
      {isLoading ?
        //   <View style={[StyleSheet.absoluteFillObject, styles.container222]}>
        //     <Text>Loading Please Wait...</Text>
        //     <ProgressBar width={70}/>
        //   </View>
         // sync11(),
         <View style={[StyleSheet.absoluteFillObject,{ flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex:1,
          backgroundColor:'rgba(0,0,0,0.65)',}]}>
         <Text style={{color:'white'}}>Syncing Please Wait...</Text>
         <Lottie
    source={require('./src/assets/loading11.json')} autoPlay loop speed={1}
    //   progress={animationProgress.current}
    />
         <ProgressBar width={70}/>
         
     </View> 
        :
          null
        }
        </NativeBaseProvider>
  )
}

function CustomDrawerContent({navigation}) {

  const [language, setLanguage] = useState("");
  const [email, SetEmail] = useState('');
  const [name, setName] = useState('');
  
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        const data = JSON.parse(value);
        setName(data.UserName);
        SetEmail(data.UserEmail);
      }
    } 
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const LogoutHandle = async() => {
    try {
      await AsyncStorage.removeItem('@storage_Key');
    } 
    catch(e) {
      console.log(e);
    }
  }

  return (
    <NativeBaseProvider>
      {email ?
        <Box pt={4} px={4}>
          <Avatar bg="#004aad" alignSelf="center" size="xl">
            <MaterialIcons name="account" style={{fontSize: 60, color: 'white'}}/>
          </Avatar>
          <Heading alignSelf="center" mt={2}>{name}</Heading>
          <Text alignSelf="center">{email}</Text>
          <Button onPress={()=>{LogoutHandle(), navigation.navigate('Login'), navigation.closeDrawer()}} mt={2} style={{backgroundColor: '#004aad',}}>Logout</Button>
        </Box>
      :
        <Box pt={4} px={4}>
          <Button onPress={()=>{navigation.navigate('Login'), navigation.closeDrawer()}} mt={2} style={{backgroundColor: '#004aad',}}>Login</Button>
        </Box>
      }
      <Divider my="4" />
      <Box px={4}>
        <Button variant="outline" onPress={()=>{navigation.navigate('Main'), navigation.closeDrawer()}} style={{color: '#004aad', borderColor: '#004aad'}}><Text style={{color: '#004aad'}}>Home</Text></Button>
        <Button variant="outline" onPress={()=>{navigation.navigate('StartTrip'), navigation.closeDrawer()}} mt={4} style={{color: '#004aad', borderColor: '#004aad'}}><Text style={{color: '#004aad'}}>Start Trip</Text></Button>
      </Box>
      <Divider my="4" />
      <Box px={4}>
        <Select selectedValue={language} minWidth="200" accessibilityLabel="Choose Language" placeholder="Choose Language" _selectedItem={{bg: "#004aad", color: 'white'}} mt={0} onValueChange={itemValue => setLanguage(itemValue)}>
          <Select.Item label="English (EN)" value="English" />
          <Select.Item label="Hindi (HI)" value="Hindi" />
          <Select.Item label="Marathi (MT)" value="Marathi" />
          <Select.Item label="Urdu (UD)" value="Urdu" />
          <Select.Item label="Telgu (TG)" value="Telgu" />
          <Select.Item label="Tamil (TL)" value="Tamil" />
        </Select>
      </Box>
      <Center style={{bottom: 0, position: 'absolute', left: '15%'}}>
        <Image style={{ width: 200, height: 150 }} source={require('./src/assets/image.png')} alt={"Logo Image"} />
      </Center>
    </NativeBaseProvider>
  )
}

export default function App({navigation}) {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="home" component={StackNavigators} 
          options={{
            header: () => null
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
