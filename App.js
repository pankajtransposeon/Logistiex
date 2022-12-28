import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NativeBaseProvider, Box, Text, Image, Avatar, Heading, Button, Select, Divider, Icon, Center } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './src/components/Login';
import Main from './src/components/Main1';
import NewSellerPickup from './src/components/newSeller/NewSellerPickup';
import NewSellerSelection from './src/components/newSeller/NewSellerSelection';
import ShipmentBarcode from './src/components/newSeller/ShipmentBarcode';
import { Graph } from './src/components/Graph';
import MapScreen from './src/components/MapScreen';
import Reject from './src/components/RejectReason';
import POD from './src/components/newSeller/POD';
import { TouchableOpacity, View } from 'react-native';
import Dashboard from './src/components/Dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          // headerTitle: (props) => (
          //   <NativeBaseProvider>
          //     <Image style={{ width: 250, height: 80, marginTop: 10 }} source={require('./src/assets/logo.png')} alt={"Logo Image"} />
          //   </NativeBaseProvider>
          // ),
          headerTitle: (props) => (
            <NativeBaseProvider>
              <Heading style={{color: 'white'}} size="md">Dashboard</Heading>
            </NativeBaseProvider>
          ),
          headerLeft: () => (
            <MaterialIcons name="menu" style={{fontSize: 30, marginLeft: 10, color: 'white'}} onPress={()=>navigation.toggleDrawer()} />
          ),
          // headerRight: () => (
          //   <NativeBaseProvider>
          //     <Button style={{backgroundColor: 'white', color: 'blue'}} leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" />} > Sync</Button>
          //   </NativeBaseProvider>
          // )
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
          // headerRight: () => (
          //   <NativeBaseProvider>
          //     <Button style={{backgroundColor: 'white', color: 'blue'}} leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" />} > Sync</Button>
          //   </NativeBaseProvider>
          // )
        }}
      />

      <Stack.Screen name="NewSellerSelection" component={NewSellerSelection} 
        options={{
        header: () => null
      }} />

      <Stack.Screen name="ShipmentBarcode" component={ShipmentBarcode}
        options={{
          header: () => null
        }} /> 

      {/* <Stack.Screen name="Graph" component={Graph}
        options={{
          header: () => null
        }} /> */}

      <Stack.Screen name="MapScreen" component={MapScreen}
        options={{
          header: () => null
        }} 
      />
      <Stack.Screen name="reject" component={Reject} 
        options={{
          header: () => null
        }} 
      />
      <Stack.Screen name="POD" component={POD} 
        options={{
          header: () => null
        }} 
      />
      {/* <Stack.Screen name="Dashboard" component={Dashboard}
        options={{
          header: () => null
      }} />      */}
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
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const LogoutHandle = async() => {
      try {
        await AsyncStorage.removeItem('@storage_Key')
      } catch(e) {
        console.log(e);
      }
  }


  return (
    <NativeBaseProvider>
      <Box pt={4} px={4}>
        <Avatar bg="#004aad" alignSelf="center" size="xl">
          <MaterialIcons name="account" style={{fontSize: 60, color: 'white'}}/>
        </Avatar>
        <Heading alignSelf="center" mt={2}>{name}</Heading>
        <Text alignSelf="center">{email}</Text>
        <Button onPress={()=>{LogoutHandle() ,navigation.navigate('Login'), navigation.closeDrawer()}} mt={2} style={{backgroundColor: '#004aad',}}>Logout</Button>
      </Box>
      <Divider my="4" />
      <Box px={4}>
        <Select selectedValue={language} minWidth="200" accessibilityLabel="Choose Language" placeholder="Choose Language" _selectedItem={{bg: "#004aad", color: 'white'}} mt={1} onValueChange={itemValue => setLanguage(itemValue)}>
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
