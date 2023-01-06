import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {NativeBaseProvider, Box, Center, VStack, Button, Icon, Input, Heading, Alert, Text, Modal, ScrollView, AspectRatio } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, View } from 'react-native';


export default function StartEndDetails() {

  const [vehicle, setVehicle] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(0);
  const [data, setData] = useState();
  const [printData, setPrintData] = useState([]);
  const [loginClicked, setLoginClicked] = useState(false);
  const navigation = useNavigation();

    const getData = 'https://bked.logistiex.com/UserTripInfo/getUserTripInfo';

    useEffect(() => {
        (async () => {
            await axios.get(getData).then((res) => {
                setData(res.data);
                console.log(res.data);
                getDataLocal();
            }, (error) => {
                Alert.alert(error);
            });
        })();
    }, []);

const getDataLocal = async () => {
  try {
    const value = await AsyncStorage.getItem('@TripID')
    if(value !== null) {
      const datavalue = JSON.parse(value);
      console.log(datavalue, 'data')
      if(res && res.data){
        const arr = data.res_data.filter((res) => res.tripID === datavalue);
        setPrintData(arr);
      }
      return;
    }
  } catch(e) {
    console.log(e);
  }
}

  return (
    <NativeBaseProvider>
        <Box flex={1} bg="#004aad" alignItems="center" pt={'40%'} height={"100%"} >
            <Box justifyContent="space-between" py={2} px={6} height={"50%"} bg="#fff" rounded="xl" width={"90%"} maxWidth="100%" _text={{fontWeight: "medium",}}>
            <ScrollView>
            {
                printData &&
                printData.map((res, i) =>{
                    return(
                      <View>
                        <Button key={i} title="Login" backgroundColor='#004aad'  _text={{ color: 'white', fontSize: 20 }} onPress={()=>ImageHandle()}>{res.tripID}</Button>
                      <View style={styles.container}>
                        <Image
                          style={styles.stretch}
                          source={{uri : res.startVehicleImageUrl}}
                        />
                      </View>
                      </View>
                    )
                })
            }
            </ScrollView>
        </Box>
        <Center>
            <Image style={{ width: 200, height: 200 }} source={require('../assets/logo.png')} alt={"Logo Image"} />
            
        </Center>
        </Box>
    </NativeBaseProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  stretch: {
    width: 150,
    height: 150,
    resizeMode: 'stretch',
  },
});