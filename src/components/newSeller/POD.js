/* eslint-disable prettier/prettier */
import { ArrowForwardIcon, NativeBaseProvider, Box, Image, Center,Input, Modal, Heading} from 'native-base';
import{StyleSheet ,Text ,TouchableOpacity ,View ,ScrollView ,TextInput ,getPick ,Alert} from 'react-native';
import axios from 'axios';
import { HStack ,Button } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import OTPTextInput from 'react-native-otp-textinput';

const POD = ({route}) => {

  var otpInput = useRef(null)

  const [name, setName] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState(route.params.phone);
  const [latitude, setLatitude] = useState(0);
  const [longitude , setLongitude] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const clearText = () => {
    otpInput.current.clear();
  }

  const setText = () => {
    otpInput.current.setValue("1234");
  }

useEffect(() => {
  const current_location = () => {

    return GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
    })
    .then(latestLocation => {
        console.log('latest location '+JSON.stringify(latestLocation))
        return latestLocation;
    }).then(location => {
        const currentLoc = { latitude: location.latitude, longitude: location.longitude };
        setLatitude(location.latitude);
        setLongitude(location.longitude);
        return currentLoc;
    }).catch(error => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
        })
        .then(status=>{
            if(status)
                console.log('Location enabled');
        }).catch(err=>{
        })
        return false;
    })
};

  current_location();
}, []);

const submitForm = () => {
  alert('Your Data has submitted');
  axios.post('https://bked.logistiex.com/SellerMainScreen/postRD', {
    excepted:route.params.Forward,
    accepted: route.params.accepted,
    rejected:route.params.rejected,
    nothandedOver:0,
    feUserID: route.params.userId,
    receivingDate : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
    receivingTime: new Date().toLocaleString(),
    latitude : latitude,
    longitude : longitude,
    ReceiverMobileNo : route.params.phone,
    ReceiverName: name
    
})
    .then(function (response) {
        console.log(response.data, "hello");
        alert('Your Data has submitted');
    })
    .catch(function (error) {
        console.log(error);
    });
}

  const sendSmsOtp = async () => {
    console.log(mobileNumber);
    const response = await axios.post('https://bked.logistiex.com/SMS/msg', {
      "mobileNumber": mobileNumber,
    });
    if(response.status === 200) {
      setShowModal(true);
    } 
    else {
      console.log("Otp not send", response);
    }
  }

  function validateOTP(){
    axios.post("https://bked.logistiex.com/SMS/OTPValidate", {
      mobileNumber: mobileNumber,
      otp: inputOtp
    })
    .then(response => {
      if(response.data.return){
        submitForm();
        setInputOtp("");
        setShowModal(false);
      }
      else{
        alert("Invalid OTP, please try again !!");
      }
    })
    .catch(error => {
      alert("Invalid OTP, please try again !!");
      console.log(error);
    })
  }

  return (
    <NativeBaseProvider>
      <Modal w="100%" isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content w="100%" bg={'#eee'}>
          <Modal.CloseButton />
          <Modal.Body w="100%">
            <Modal.Header>Enter the OTP</Modal.Header>
            <OTPTextInput
              ref={e => (otpInput = e)}
              inputCount={6}
              handleTextChange={(e)=>setInputOtp(e)}
            />
            <Box flexDir="row" justifyContent="space-between" mt={3}>
              <Button w="40%" bg="gray.500" onPress={()=>sendSmsOtp()}>Resend</Button>
              <Button w="40%" bg="#004aad" onPress={()=>validateOTP()}>Submit</Button>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <View style={{backgroundColor: 'white', flex: 1, paddingTop: 30}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center'}}>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>Expected</Text>
              <Text style={{fontSize: 18, fontWeight: '500'}}>{route.params.Forward}</Text>
            </View>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>Accepted</Text>
              <Text style={{fontSize: 18, fontWeight: '500'}}>{route.params.accepted}</Text>
            </View>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>     
              <Text style={{fontSize: 18, fontWeight: '500'}}>Rejected</Text>
              <Text style={{fontSize: 18, fontWeight: '500'}}>{route.params.rejected}</Text>
            </View>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: 'lightgray', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10}}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>Not Handed Over</Text>
              <Text style={{fontSize: 18, fontWeight: '500'}}>{0}</Text>
            </View>
          </View>
          <Center>
            <Input mx="3" mt={4} placeholder="Receiver Name" w="90%" bg="gray.200" size="lg" value={name} onChangeText={(e)=>setName(e)} />
            <Input mx="3" my={4} placeholder="Mobile Number" w="90%" bg="gray.200" size="lg" value={mobileNumber} onChangeText={(e)=>setMobileNumber(e)} />
            <Button w="90%" size="lg" style={{backgroundColor:'#004aad', color:'#fff'}}  title="Submit"  onPress={() => sendSmsOtp()} >Submit</Button>
          </Center>
          <Center>
            <Image style={{ width:150, height:150 }} source={require('../../assets/image.png')} alt={"Logo Image"} />
          </Center>
        </ScrollView>
      </View>
    </NativeBaseProvider>
  );
};

export default POD;

export const styles = StyleSheet.create({


  normal:{
      fontFamily:'open sans',
      fontWeight:'normal',
      color:'#eee',
      marginTop:20,
      marginLeft:10,
      marginRight:10,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#eee',
      width: 'auto',
      borderRadius:0
  },

  text:{
    paddingLeft:20,
    color:'#000',
    fontWeight:'normal',
    fontSize:18
  },
  container:{
      flex:1,
      fontFamily:'open sans',
      fontWeight:'normal',
      color:'#eee',
      paddingTop:10,
      paddingBottom:10,
      flexDirection:'row',
      justifyContent:'space-between',
      width: 'auto',
      borderWidth:1,
      borderColor:'#eee'

  },

  containerText:{

      paddingLeft:30,
      color:'#000',
      fontSize:15


  },
  otp:{
      backgroundColor:'#004aad', 
      color:'#000',
      marginTop:5,
      borderRadius:10
     
  }
})
