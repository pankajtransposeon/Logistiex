/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowForwardIcon, NativeBaseProvider, Box, Image, Center,Input, Modal, Heading, VStack, Alert} from 'native-base';
import{StyleSheet ,Text ,TouchableOpacity ,View ,ScrollView ,TextInput , ToastAndroid} from 'react-native';
import axios from 'axios';
import { HStack ,Button } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import OTPTextInput from 'react-native-otp-textinput';

import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({
  name: 'rn_sqlite',
});
const CollectPOD = ({route}) => {

  var otpInput = useRef(null)
  const navigation = useNavigation();
  const [name, setName] = useState(route.params.contactPersonName);
  const [inputOtp, setInputOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState(route.params.phone);
  const [latitude11, setLatitude11] = useState(0);
  const [longitude11 , setLongitude11] = useState(0);
  const [showModal11, setShowModal11] = useState(false);
  const [modalVisible11, setModalVisible11] = useState(false);
  const [DropDownValue11, setDropDownValue11] = useState(null);
  const [PartialCloseData, setPartialCloseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(0);
  const PartialClose = 'https://bkedtest.logistiex.com/ADupdatePrams/getPartialClosureReasons';
  const DisplayData11 = async() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM PartialCloseReasons', [], (tx1, results) => {
          let temp = [];
          // console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
          }
          // console.log('Data from Local Database partialClosure : \n ', temp);
      setPartialCloseData(temp);
          // console.log('Table6 DB OK:', temp.length);
      });
  });
    // await fetch(PartialClose)
    // .then((response) => response.json()) 
    // .then((json) => {
    //   setPartialCloseData(json);
    // })
    // .catch((error) => alert(error)) 
  }
  useEffect(() => {
    DisplayData11();   
  }, []);

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
        const currentLoc = { latitude11: location.latitude11, longitude11: location.longitude11 };
        setLatitude11(location.latitude11);
        setLongitude11(location.longitude11);
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

const submitForm11 = () => {
  alert('Your Data has submitted');
  axios.post('https://bkedtest.logistiex.com/SellerMainScreen/postRD', {
    runsheetNo: route.params.runsheetno, 
    excepted:route.params.Forward,
    accepted: route.params.accepted,
    rejected:route.params.rejected,
    nothandedOver:route.params.notDelivered,
    feUserID: route.params.userId,
    receivingTime: new Date().valueOf(),
    latitude : latitude11,
    longitude : longitude11,
    receiverMobileNo : route.params.phone,
    receiverName: name,
    consignorAction: "Seller Delivery",
    consignorCode:route.params.consignorCode
    // "receiverMobileNo":9910939792,
    // "receiverName":"Tarun",
    // "consignorCode":"Seller-1001",
    // "longitude":67.4389,
    // "latitude":77.4342,
    // "receivingTime":1678975807605,
    // "feUserID":"HEVEFE157",
    // "nothandedOver":0,
    // "rejected":3,
    // "accepted":7,
    // "expected":10,
    // "runsheetNo":"PRNSHIVEHE1581678967803161",
    // "consignorAction":"Seller Pickup"
})
    .then(function (response) {
        console.log(response.data, "hello");
    })
    .catch(function (error) {
        console.log(error);
    });
}

const sendSmsOtp = async () => {
  console.log(mobileNumber);
  const response = await axios.post('https://bkedtest.logistiex.com/SMS/msg', {
    'mobileNumber': mobileNumber,
  }).then(setShowModal11(true)).catch((err=>console.log('OTP not send')));
};

  function handleButtonPress11(item) {
    // if(item=='Partial Dispatch'){
    //   navigation.navigate('Dispatch');
    // }
      setDropDownValue11(item);
    // setModalVisible11(false);
  }

  function validateOTP(){
    axios.post('https://bkedtest.logistiex.com/SMS/OTPValidate', {
      mobileNumber: mobileNumber,
      otp: inputOtp,
    })
    .then(response => {
      if (response.data.return){
        // alert("OTP Submitted Successfully")
        setMessage(1)
        submitForm11();
        setInputOtp('');
        setShowModal11(false);


        db.transaction((tx) => {
          tx.executeSql('UPDATE SellerMainScreenDetails SET status="notDelivered" , rejectedReason=? WHERE shipmentAction="Seller Delivery" AND status IS Null And consignorCode=?', [DropDownValue11,route.params.consignorCode], (tx1, results) => {
            let temp = [];
            // console.log("Not Picked Reason",DropDownValue);
            // console.log('Results',results.rowsAffected);
            // console.log(results);
            if (results.rowsAffected > 0) {
              ToastAndroid.show('Partial Closed Successfully',ToastAndroid.SHORT);
              // setDropDownValue11('');
  
            }
            //  else {
            //   console.log('failed to add notPicked item locally');
            // }
            console.log(results.rows.length);
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
          });
        });


        ToastAndroid.show('Submit Successful',ToastAndroid.SHORT);
        navigation.navigate('Main',{
          userId:route.params.userId,
        });
      }
      else {
        // alert('Invalid OTP, please try again !!');
        setMessage(2);
      }
    })
    .catch(error => {
      // alert('Invalid OTP, please try again !!');
      setMessage(2)
      console.log(error);
    });
    setShowModal(true);
  }
  return (
    <NativeBaseProvider>
      <Modal w="100%" isOpen={showModal11} onClose={() => setShowModal11(false)}>
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content backgroundColor={message === 1 ? '#dcfce7' : '#fee2e2'}>
            <Modal.CloseButton />
            <Modal.Body>
              <Alert w="100%" status={message === 1 ? 'success' : 'error'}>
                <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                  <Alert.Icon size="4xl" />
                  <Text my={3} fontSize="md" fontWeight="medium">{message === 1 ? 'OTP Submitted Successfully' : 'Invalid OTP, please try again !!'}</Text>
                </VStack>
              </Alert>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      
      <View style={{backgroundColor: 'white', flex: 1, paddingTop: 30}}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center', marginTop: 15}}>
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
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Tagged</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{route.params.tagged}</Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: 'lightgray', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Not Handed Over</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{route.params.notDelivered}</Text>
              </View>
            </View>
          <Center>
            <Input mx="3" mt={4} placeholder="Receiver Name" w="90%" bg="gray.200" size="lg" value={name} onChangeText={(e)=>setName(e)} />
            <Input mx="3" my={4} placeholder="Mobile Number" w="90%" bg="gray.200" size="lg" value={mobileNumber} onChangeText={(e)=>setMobileNumber(e)} />
            <Button w="90%" size="lg" style={{backgroundColor:'#004aad', color:'#fff', marginBottom:10}}  title="Generate"  onPress={() => {setShowModal11(true);sendSmsOtp()}} >Generate OTP</Button>
          </Center>
          <Center>
            <Image style={{ width:150, height:150 }} source={require('../../assets/image.png')} alt={"Logo Image"} />
          </Center>
        </ScrollView>
      </View>
    </NativeBaseProvider>
  );
};

export default CollectPOD;

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
