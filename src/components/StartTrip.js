import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {NativeBaseProvider, Box, Image, Center, VStack, Button, Icon, Input, Heading, Alert, Text, Modal } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PermissionsAndroid, Pressable, SafeAreaView, StyleSheet, TouchableHighlight, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from "react-native-pure-jwt";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Marker from 'react-native-image-marker';

export default function StartTrip() {

  const [vehicle, setVehicle] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(0);
  const [loginClicked, setLoginClicked] = useState(false);
  const navigation = useNavigation();

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };


  const takePhoto= async()=>{
    let options = {
        mediaType:'photo',
        quality:1,
        cameraType:'back',
        maxWidth : 480,
        maxHeight : 480,
    }
    let isGranted = await requestCameraPermission();
    let result = null;
    if(isGranted){
        result = await launchCamera(options);
        console.log(result)
    }
    if(result.assets !== undefined){        
        console.log('canera status : '+JSON.stringify(result))
        const filePAth=result.assets[0].uri
        let date=new Date()
        Marker.markText({
            src: filePAth,
            text: `${date.toLocaleString("en-US", {timeZone: "Asia/Kolkata"})}`, 
            position: 'bottomRight', 
            color: '#FF0000',
            fontName: 'Arial-BoldItalicMT', 
            fontSize: 25, 
            scale: 1, 
            quality: 100,
            saveFormat:'png'
        })
        .then(async(path)=>{
            console.log('marked path : '+path)
            await axios.post('https://bked.logistiex.com/DSQCPicture/uploadPicture', {
                file : path,
                useCase : 'trip',
                type : "image/jpeg",
                contextId : "785",
                contextType: 'kkhkhb',
                hubCode :"784"
            })
            .then(function (response) {
                console.log(response.data, "Data has been pushed");
            })
            .catch(function (error) {
                console.log(error);
            });
        })
        .catch((e)=>{console.log(e)})
    }
}

  
  return (
    <NativeBaseProvider>
        <Box flex={1} bg="#004aad" alignItems="center" pt={'40%'}>
            <Box justifyContent="space-between" py={10} px={6} bg="#fff" rounded="xl" width={"90%"} maxWidth="100%" _text={{fontWeight: "medium",}}>
            <VStack space={6}>
                <Input value={vehicle} onChangeText={setVehicle} size="lg" placeholder="Enter your vehical no." />
                <Input value={password} onChangeText={setPassword} size="lg" type={"number"} placeholder="Input vehicle KMs" />
                <Button title="Login" backgroundColor='#004aad' _text={{ color: 'white', fontSize: 20 }} onPress={()=>takePhoto()}>Image Click</Button>
            </VStack>
        </Box>
        <Center>
            <Image style={{ width: 200, height: 200 }} source={require('../assets/logo.png')} alt={"Logo Image"} />
        </Center>
        </Box>
    </NativeBaseProvider>
  );
}
