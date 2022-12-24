import React from 'react';
import 'react-native-gesture-handler';
import { NativeBaseProvider, Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Component/Login';
import Main from './src/Component/Main';
import NewSellerPickup from './src/NewSeller/NewSellerPickup';
import NewSellerSelection from './src/NewSeller/NewSellerSelection';
import ShipmentBarcode from './src/NewSeller/ShipmentBarcode';
import { Graph } from './src/Component/Graph';
import MapScreen from './src/Component/MapScreen';
import Reject from './src/Component/RejectReason';
import POD from './src/NewSeller/POD';
import Dashboard from './src/Component/Dashboard';
import loading1 from './src/Component/loading1';


const Stack = createStackNavigator();

function App() {
  return (

    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Login'}>

          <Stack.Screen name="Login" component={Login}
            options={{
              header: () => null
            }} />

           <Stack.Screen name="Main" component={Main}
            options={{
              header: () => null
            }} />

           <Stack.Screen name="NewSellerPickup" component={NewSellerPickup}
            options={{
              header: () => null
            }} />

          <Stack.Screen name="NewSellerSelection" component={NewSellerSelection} 
           options={{
            header: () => null
          }} />

          <Stack.Screen name="ShipmentBarcode" component={ShipmentBarcode}
            options={{
              header: () => null
            }} /> 

          <Stack.Screen name="Graph" component={Graph}
            options={{
              header: () => null
            }} />

          <Stack.Screen name="MapScreen" component={MapScreen}
            options={{
              header: () => null
            }} />

          <Stack.Screen name="reject" component={Reject} 
           options={{
            header: () => null
          }} />

          <Stack.Screen name="POD" component={POD} 
           options={{
            header: () => null
          }} />

          <Stack.Screen name="Dashboard" component={Dashboard}
            options={{
              header: () => null
          }} />  

          <Stack.Screen name="loading1" component={loading1}
            options={{
              header: () => null
            }} />   
           
         
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>



  );
}


export default App;

