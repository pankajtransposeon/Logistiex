/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowForwardIcon, NativeBaseProvider, Box, Image, Center,Input, Modal, Heading} from 'native-base';
// import{StyleSheet ,Text ,TouchableOpacity ,View ,ScrollView ,TextInput ,getPick ,Alert} from 'react-native';
// import axios from 'axios';
// import { HStack ,Button } from 'native-base';
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import GetLocation from 'react-native-get-location';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import OTPTextInput from 'react-native-otp-textinput';

// import { openDatabase } from 'react-native-sqlite-storage';

// const db = openDatabase({
//   name: 'rn_sqlite',
// });
const POD = ({route}) => {

  // var otpInput = useRef(null)
  // const navigation = useNavigation();
  // const [name, setName] = useState('');
  // const [inputOtp, setInputOtp] = useState('');
  // const [mobileNumber, setMobileNumber] = useState(route.params.phone);
  // const [latitude11, setLatitude11] = useState(0);
  // const [longitude11 , setLongitude11] = useState(0);
  // const [showModal11, setShowModal11] = useState(false);
  // const [modalVisible11, setModalVisible11] = useState(false);
  // const [DropDownValue11, setDropDownValue11] = useState(null);
  // const [PartialCloseData, setPartialCloseData] = useState([]);
  // const PartialClose = 'https://bked.logistiex.com/ADupdatePrams/getPartialClosureReasons';
  // const DisplayData11 = async() => {
  //   db.transaction(tx => {
  //     tx.executeSql('SELECT * FROM PartialCloseReasons', [], (tx1, results) => {
  //         let temp = [];
  //         // console.log(results.rows.length);
  //         for (let i = 0; i < results.rows.length; ++i) {
  //             temp.push(results.rows.item(i));
  //         }
  //         // console.log('Data from Local Database partialClosure : \n ', temp);
  //     setPartialCloseData(temp);
  //         // console.log('Table6 DB OK:', temp.length);
  //     });
  // });
  //   // await fetch(PartialClose)
  //   // .then((response) => response.json()) 
  //   // .then((json) => {
  //   //   setPartialCloseData(json);
  //   // })
  //   // .catch((error) => alert(error)) 
  // }
  // useEffect(() => {
  //   DisplayData11();   
  // }, []);

  // useEffect(() => {
  //   partialClose112();
  // }, []);

  // const partialClose112 = () => {
  //   if (route.params.accepted + route.params.rejected === route.params.Forward){
  //     sendSmsOtp();
  //   } else {
  //     setModalVisible11(true);
  //   }
  //       }

  // const clearText = () => {
  //   otpInput.current.clear();
  // }

  // const setText = () => {
  //   otpInput.current.setValue("1234");
  // }

// useEffect(() => {
//   const current_location = () => {

//     return GetLocation.getCurrentPosition({
//         enableHighAccuracy: true,
//         timeout: 10000,
//     })
//     .then(latestLocation => {
//         console.log('latest location '+JSON.stringify(latestLocation))
//         return latestLocation;
//     }).then(location => {
//         const currentLoc = { latitude11: location.latitude11, longitude11: location.longitude11 };
//         setLatitude11(location.latitude11);
//         setLongitude11(location.longitude11);
//         return currentLoc;
//     }).catch(error => {
//         RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
//             interval: 10000,
//             fastInterval: 5000,
//         })
//         .then(status=>{
//             if(status)
//                 console.log('Location enabled');
//         }).catch(err=>{
//         })
//         return false;
//     })
// };

//   current_location();
// }, []);

// const submitForm11 = () => {
//   alert('Your Data has submitted');
//   axios.post('https://bked.logistiex.com/SellerMainScreen/postRD', {
//     excepted:route.params.Forward,
//     accepted: route.params.accepted,
//     rejected:route.params.rejected,
//     nothandedOver:0,
//     feUserID: route.params.userId,
//     receivingDate : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
//     receivingTime: new Date().toLocaleString(),
//     latitude11 : latitude11,
//     longitude11 : longitude11,
//     ReceiverMobileNo : route.params.phone,
//     ReceiverName: name
    
// })
//     .then(function (response) {
//         console.log(response.data, "hello");
//         alert('Your Data has submitted');
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
// }

//   const sendSmsOtp = async () => {
//     console.log(mobileNumber);
//     const response = await axios.post('https://bked.logistiex.com/SMS/msg', {
//       "mobileNumber": mobileNumber,
//     });
//     if(response.status === 200) {
//       setShowModal11(true);
//     } 
//     else {
//       console.log("Otp not send", response);
//     }
//   }

//   function handleButtonPress11(item) {
//     // if(item=='Partial Dispatch'){
//     //   navigation.navigate('Dispatch');
//     // }
//       setDropDownValue11(item);
//     // setModalVisible11(false);
//   }

//   function validateOTP(){
//     axios.post("https://bked.logistiex.com/SMS/OTPValidate", {
//       mobileNumber: mobileNumber,
//       otp: inputOtp
//     })
//     .then(response => {
//       if(response.data.return){
//         submitForm11();
//         setInputOtp("");
//         setShowModal11(false);
//       }
//       else{
//         alert("Invalid OTP, please try again !!");
//       }
//     })
//     .catch(error => {
//       alert("Invalid OTP, please try again !!");
//       console.log(error);
//     })
//   }

  return (
    <NativeBaseProvider>
      {/* <Modal w="100%" isOpen={showModal11} onClose={() => setShowModal11(false)}>
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
      <Modal isOpen={modalVisible11} onClose={() => setModalVisible11(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Partial Close Reason Code</Modal.Header>
          <Modal.Body>
            {(PartialCloseData ) &&
            PartialCloseData.map((d,index) => (
            <Button key={d.reasonID} flex="1" mt={2} marginBottom={1.5} 
             marginTop={1.5} style={{backgroundColor: d.reasonName === DropDownValue11 ? "#6666FF":"#C8C8C8"}}  title={d.reasonName} onPress={() => handleButtonPress11(d.reasonName)} >
            <Text style={{color:d.reasonName==DropDownValue11?'white':'black'}}>{d.reasonName}</Text></Button>
            ))
          }
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} onPress={() => setModalVisible11(false)} >
            Submit</Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <View style={{backgroundColor: 'white', flex: 1, paddingTop: 30}}>
        <ScrollView showsVerticalScrollIndicator={false}>
        
          <Center>
            <Input mx="3" mt={4} placeholder="Receiver Name" w="90%" bg="gray.200" size="lg" value={name} onChangeText={(e)=>setName(e)} />
            <Input mx="3" my={4} placeholder="Mobile Number" w="90%" bg="gray.200" size="lg" value={mobileNumber} onChangeText={(e)=>setMobileNumber(e)} />
            <Button w="90%" size="lg" style={{backgroundColor:'#004aad', color:'#fff'}}  title="Submit"  onPress={() => sendSmsOtp()} >Submit</Button>
            <Button w="90%" mt={2} size="lg" style={{backgroundColor:'#004aad', color:'#fff'}}  title="Submit"  onPress={() => setModalVisible11(true)} >Partial Close</Button>
          </Center>
          <Center>
            <Image style={{ width:150, height:150 }} source={require('../../assets/image.png')} alt={"Logo Image"} />
          </Center>
        </ScrollView>
      </View> */}
    </NativeBaseProvider>
  );
};

export default POD;

// export const styles = StyleSheet.create({


//   normal:{
//       fontFamily:'open sans',
//       fontWeight:'normal',
//       color:'#eee',
//       marginTop:20,
//       marginLeft:10,
//       marginRight:10,
//       paddingTop:10,
//       paddingBottom:10,
//       backgroundColor:'#eee',
//       width: 'auto',
//       borderRadius:0
//   },

//   text:{
//     paddingLeft:20,
//     color:'#000',
//     fontWeight:'normal',
//     fontSize:18
//   },
//   container:{
//       flex:1,
//       fontFamily:'open sans',
//       fontWeight:'normal',
//       color:'#eee',
//       paddingTop:10,
//       paddingBottom:10,
//       flexDirection:'row',
//       justifyContent:'space-between',
//       width: 'auto',
//       borderWidth:1,
//       borderColor:'#eee'

//   },

//   containerText:{

//       paddingLeft:30,
//       color:'#000',
//       fontSize:15


//   },
//   otp:{
//       backgroundColor:'#004aad', 
//       color:'#000',
//       marginTop:5,
//       borderRadius:10
     
//   }
// })
