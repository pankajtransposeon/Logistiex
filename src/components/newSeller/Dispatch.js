/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Item, Input, Icon, Button, NativeBaseProvider , Center} from 'native-base';
import axios from 'axios';
import{Text,View, ScrollView, Vibration, ToastAndroid,TouchableOpacity,StyleSheet, PermissionsAndroid} from 'react-native';
import {Searchbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { openDatabase } from "react-native-sqlite-storage";
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const db = openDatabase({
  name: "rn_sqlite",
});

const Dispatch = ({route}) => {
    const [keyword, setKeyword] = useState("");

    const onSuccess = e => {	
        console.log(e.data, 'barcode');	
        getCategories(e.data);	
        setBarcode(e.data);	
      }
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

      const openCamera= async()=>{
        let options = {
            mediaType:'photo',
            quality:1,
            cameraType:'back',
            maxWidth : 480,
            maxHeight : 480,
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
        }
        let isGranted = await requestCameraPermission();
        let result = null;
        if(isGranted){
            result = await launchCamera(options);
            console.log(result)
        }
        
    }
  
  return (
    <NativeBaseProvider>
        <Text style={{fontSize:20, marginTop:10, textAlign:'center',fontWeight:'500'}}>List of Bags to Dispatch</Text>
        <View style={styles.container}>
        <Searchbar
        placeholder="Scan Bag Seal ID"
        onChangeText={(e) => setKeyword(e)}
        value={keyword}
        style={{width:'85%', backgroundColor:"#E0E0E0"}}
       />                
      <Button style={{backgroundColor:"#E0E0E0"}} onPress={()=>{openCamera()}} leftIcon={<Icon color="white" as={<MaterialIcons name="camera" />} size="sm"  style={styles.cameraIcon} />}>
      </Button>
      </View>
      <View style={{backgroundColor: 'white', flex: 1, paddingTop: 30}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center'}}>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>Eligible Bags</Text>
              <Text style={{fontSize: 18, fontWeight: '500'}}>123</Text>
            </View>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>Scanned</Text>
              <Text style={{fontSize: 18, fontWeight: '500'}}>12</Text>
            </View>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>     
              <Text style={{fontSize: 18, fontWeight: '500'}}>Pending</Text>
              <Text style={{fontSize: 18, fontWeight: '500'}}>111</Text>
            </View>
          </View>
          <View style={{alignItems: 'center', marginTop:20, marginBottom:50}}>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Bag ID</Text>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Shipments</Text>
            </View>
          </View>
          <Center>
            <Button w="48%" size="lg" style={{backgroundColor:'#004aad', color:'#fff', marginBottom:0}}  title="Dispatch">Dispatch</Button>
          </Center>
          {/* <Center>
            <Image style={{ width:150, height:150 }} source={require('../../assets/image.png')} alt={"Logo Image"} />
          </Center> */}
        </ScrollView>
      </View>
    </NativeBaseProvider>
  );
};

export default Dispatch;

export const styles = StyleSheet.create({
    cameraIcon: {
        color: '#000',
        fontSize: 25,
      },
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#E0E0E0",
        margin:15
      },
  });