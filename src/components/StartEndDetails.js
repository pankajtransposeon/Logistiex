import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {NativeBaseProvider, Box, Center, VStack, Button, Icon, Input, Heading, Alert, Text, Modal, ScrollView, AspectRatio, Stack, HStack, Divider, Link, Code } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, View } from 'react-native';


export default function StartEndDetails() {

  
  const [data, setData] = useState();
  const [printData, setPrintData] = useState([]);
  const navigation = useNavigation();

    const getData = 'https://bked.logistiex.com/UserTripInfo/getUserTripInfo';

    useEffect(() => {
        (async () => {
            await axios.get(getData).then((res) => {
                setData(res.data);
                getDataLocal();
            }, (error) => {
                Alert.alert(error);
            });
        })();
    }, [printData]);

const getDataLocal = async () => {
  try {
    const value = await AsyncStorage.getItem('@TripID')
    if(value !== null) {
      const datavalue = JSON.parse(value);
      if(datavalue && data){
        const arr = data.res_data.filter((res) => res.tripID === datavalue);
        setPrintData(arr);
      }
      return;
    }
  } catch(e) {
    console.log(e);
  }
}

console.log('dcdc')
  
    return (

      printData.length ?
      (
        <NativeBaseProvider>
        <ScrollView>
        <Box flex={1} bg="coolGray.100" p={4}>
        
    
        <Box
          _light={{ bg: "coolGray.50" }}
          _dark={{ bg: "coolGray.900" }}
          justifyContent="center"
          px={4}
          
        >
          <VStack space={5} alignItems="center">
            
            <Heading size="lg">Detail</Heading>
            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems='center'>
                  <Text color="black" _dark={{
                      color: "gray.400"
                      }} fontWeight="400">
                      Start Time
                  </Text>
              </HStack>
              <HStack style={{ width: 200 }} alignItems="center">
                  <Text color="black" _dark={{
                      color: "gray.400"
                      }} fontWeight="400">
                      {printData[0].startTime}
                  </Text>
              </HStack>
            </HStack>

            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems='center'>
                  <Text color="black" _dark={{
                      color: "gray.400"
                      }} fontWeight="400">
                      Start Kilometer
                  </Text>
              </HStack>
              <HStack style={{ width: 200 }} alignItems="center">
                  <Text color="black" _dark={{
                      color: "gray.400"
                      }} fontWeight="400">
                      {printData[0].startKilometer}
                  </Text>
              </HStack>
            </HStack>

            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems='center'>
                  <Text color="black" _dark={{
                      color: "gray.400"
                      }} fontWeight="400">
                      End Kilometer
                  </Text>
              </HStack>
              <HStack style={{ width: 200 }}  alignItems="center">
                  <Text textAlign='center' alignItems='center' justifyContent='center' color="black" _dark={{
                      color: "gray.400"
                      
                      }} fontWeight="400">
                      {printData[0].startKilometer}
                  </Text>
              </HStack>
            </HStack>

            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems='center'>
                  <Text color="black" _dark={{
                      color: "gray.400"
                      }} fontWeight="400">
                      Start Image
                  </Text>
              </HStack>
              <HStack alignItems="center">
              <Image 
              source={{ uri: printData[0].startVehicleImageUrl}} 
              style={{ width: 200, height: 200 }} 
              alt = 'image not shown'
                    />
              </HStack>
            </HStack>
            

            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems='center'>
                  <Text color="black" _dark={{
                      color: "gray.400"
                      }} fontWeight="400">
                      End Image
                  </Text>
              </HStack>
              <HStack alignItems="center">
              <Image 
              source={{ uri: printData[0].startVehicleImageUrl}} 
              style={{ width: 200, height: 200 }} 
              alt = 'image not shown'
                    />
              </HStack>
            </HStack>
            


          </VStack>
        </Box>
          <Center>
            <Image style={{ width: 150, height: 100 }} source={require('../assets/image.png')} alt={"Logo Image"} />
          </Center>
        </Box>
        </ScrollView>              
      </NativeBaseProvider>
      ) : (
        <NativeBaseProvider>
          <Text>Loading</Text>
        </NativeBaseProvider>
      )
      
      // <NativeBaseProvider>
      //     <Box flex={1} bg="#004aad" alignItems="center" pt={'4%'} height={"100%"} >
      //         <Box justifyContent="space-between" py={2} px={6} height={"80%"} bg="#fff" rounded="xl" width={"90%"} maxWidth="100%" _text={{fontWeight: "medium",}}>
      //         <ScrollView>
      //         {
      //             printData &&
      //             printData.map((res, i) =>{
      //                 return(
      //                   <ScrollView key={i}>
      //                     <View>
      //                     <Button title="Login" backgroundColor='#004aad'  _text={{ color: 'white', fontSize: 20 }}>{res.tripID}</Button>
      //                     <Button title="Login" backgroundColor='#004aad'  _text={{ color: 'white', fontSize: 20 }}>Vehicle Number {res.vehicleNumber}</Button>
      //                     <Button title="Login" backgroundColor='#004aad'  _text={{ color: 'white', fontSize: 20 }}>startTime {res.startTime}</Button>
      //                     <Button title="Login" backgroundColor='#004aad'  _text={{ color: 'white', fontSize: 20 }}>startKilometer {res.startKilometer}</Button>
      //                   <View style={styles.container}>
      //                     <Image
      //                       style={styles.stretch}
      //                       source={{uri : res.startVehicleImageUrl}}
      //                     />
      //                   </View>
      //                   </View>
      //                   </ScrollView>
      //                 )
      //             })
      //         }
      //         </ScrollView>
      //     </Box>
      //     <Center>
      //         <Image style={{ width: 200, height: 200 }} source={require('../assets/logo.png')} alt={"Logo Image"} />
              
      //     </Center>
      //     </Box>
      // </NativeBaseProvider>
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