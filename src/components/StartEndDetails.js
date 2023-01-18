import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {NativeBaseProvider, Box, Center, VStack, Button, Icon, Input, Heading, Alert, Text, Modal, ScrollView, AspectRatio, Stack, HStack, Divider, Link, Code } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, View } from 'react-native';


export default function StartEndDetails() {

  
  const [data, setData] = useState();
  // const [printData, setPrintData] = useState([{
  //   "_id": "63bc00ba4587976c951c2170",
  //   "tripID": "Mon Jan 09 2023 17:25:14 GMT+0530UI001",
  //   "userID": "UI001",
  //   "date": "2023-01-09T11:55:37.682Z",
  //   "startTime": "10:00AM",
  //   "vehicleNumber": "Gfvh",
  //   "startKilometer": "2555",
  //   "startVehicleImageUrl": "https://storage.googleapis.com/logistiex-shp/DSQC/front/2023/0/9/SI002/rn_image_picker_lib_temp_dad8377e-4f00-47eb-af11-55c5842c35d6_1673265334736.jpg",
  //   "createdAt": "2023-01-09T11:55:38.785Z",
  //   "updatedAt": "2023-01-09T11:55:38.785Z",
  //   "__v": 0
  //   }]);
  const [printData,setPrintData]=useState([])
  const [tripID, setTripID] = useState("");
  const [userId, setUserId] = useState('');
  const navigation = useNavigation();

    const getData = 'https://bked.logistiex.com/UserTripInfo/getUserTripInfo';
    const getUserId = async () => {
      try {
        const value = await AsyncStorage.getItem('@storage_Key');
        if (value !== null) {
            const data = JSON.parse(value);
            setUserId(data.userId);
            // console.log(data.userId);
        } else {
            setUserId(' ');
        }
    } catch (e) {
        console.log(e);
    }
    };
    useEffect(() => {
      getUserId();
  }, []);
  const getTripID = async () => {
    try {
      const value = await AsyncStorage.getItem('@TripID')
      if(value !== null) {
        const data = JSON.parse(value);
        setTripID(data);
      }
    } catch(e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getTripID();
}, []);
let dateStart = 0; // start of the string
let dateEnd = tripID.indexOf(" ", tripID.indexOf(" ", tripID.indexOf(" ") + 1) + 1); 
let date = dateEnd ? tripID.substring(dateStart, dateEnd+5) : "No match found";
    useEffect(() => {
        // (async () => {
        //     await axios.get(getData).then((res) => {
        //         setData(res.data);
        //         getDataLocal();
        //     }, (error) => {
        //         Alert.alert(error);
        //     });
        // })();
        axios.get("https://bked.logistiex.com/UserTripInfo/getUserTripInfo", {
        params: {
        tripID: userId+"_"+date, 
      }
      }).then(response => {
      console.log('data',response.data);
      setData(response.data);
      setPrintData(response.data.res_data);
      }).catch(error => {
      console.log(error);
      });
    }, []);
    
const getDataLocal = async () => {
  try {
    const value = await AsyncStorage.getItem('@TripID')
    if(value !== null) {
      const datavalue = JSON.parse(value);
      // console.log(datavalue);
      if(datavalue && data){
        // const arr = data.res_data.filter((res) => res.tripID === datavalue);
        // console.log('value',datavalue);
        // setPrintData(data.res_data);
      }
      return;
    }
  } catch(e) {
    console.log(e);
  }
}
useEffect(() => {
  getDataLocal();
}, []);

  // console.log(printData, 'print')
  // console.log('startkilometer',printData.startKilometer)

    return (
      printData ?
      (
        <NativeBaseProvider>
        <ScrollView>
        
        <Box
        shadow="2"
        rounded="lg"
        w='100%'
       _light={{ bg: "coolGray.50" }}
       _dark={{ bg: "gray.700" }}
        marginTop={5}
>
  
    <View style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} >
    <Image style={{height:200, width:350}} source={{uri : printData.startVehicleImageUrl}} alt="image base" />
    <Text bold position="absolute" color="coolGray.50" top="0" m="4">
    Start vehicle
    </Text>
    <Image marginTop={10} style={{height:200, width:350}} source={{uri : printData.endVehicleImageUrl}} alt="image base" />
    <Text bold position="absolute" color="coolGray.50" top="40" m="20">
    End vehicle
    </Text>
    </View>
    <Stack space="2" p="4">
    <Text style={{backgroundColor:'#004aad', paddingVertical: '3%',textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center', color:'white'}}>Start Time - {printData.startTime}</Text>
    <Text style={{backgroundColor:'#004aad', paddingVertical: '3%',textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center', color:'white'}}>Vehicle Number - {printData.vehicleNumber}</Text>
    <Text style={{backgroundColor:'#004aad', paddingVertical: '3%',textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center', color:'white'}}>Start Kilometer - {printData.startKilometer}</Text>
    <Text style={{backgroundColor:'#004aad', paddingVertical: '3%',textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center', color:'white'}}>End Kilometer - {printData.endkilometer}</Text>
  </Stack>
  <HStack space="3" px="4" pb="4">
   
  </HStack>
</Box>

<Center>
<Image style={{ width: 150, height: 100 }} source={require('../assets/image.png')} alt={"Logo Image"} />
</Center>
        
  </ScrollView>              
</NativeBaseProvider>
      ) : (
        <NativeBaseProvider>
          <Text>Loading</Text>
        </NativeBaseProvider>
      )
    );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  stretch: {
    width: 170,
    height: 200,
    resizeMode: 'stretch',
  },
});