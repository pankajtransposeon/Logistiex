/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function StackNavigators({navigation}){
  return(
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
          <Button leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" color="white" />}onPress={() => newseller112.Syncsellerpickup112()
          
          
        
        
        
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
