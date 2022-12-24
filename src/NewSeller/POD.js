import { ArrowForwardIcon, NativeBaseProvider, Box, Image, Center,Input} from 'native-base';
import{StyleSheet ,Text ,TouchableOpacity ,View ,ScrollView ,TextInput ,getPick ,Alert} from 'react-native';
import axios from 'axios';
import { HStack ,Button } from 'native-base';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';


const POD = ({route}) => {


  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [OTP, setOTP] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude , setLongitude] = useState(0);
  const[data, setData] = React.useState({})
  const navigation = useNavigation();

  console.log(latitude, longitude);
  console.log(route.params.phone, mobileNumber, name, route.params.rejected, new Date().toLocaleString());

//   const handleChange = (event) => {
//     console.log("input");
//     console.log(event.target.value);
//     setValue(event.target.value);
// };

  const generateOTP = async(phone) => {
    const url ='https://bked.logistiex.com/SMS/msg';
    let returnData;
    const bodyData ={
      "moblieNumber":mobileNumber,
    };
    const response=await axios.post(url,bodyData);
    if(response.status ===200){
      returnData={
        status:'Success',
        ...response.data,
      };
    }else{
      returnData ={
        status:'Failure',
      };
    }
  }
   

const sendSmsOtp = async (phone, otp) => {
const url = 'https://bked.logistiex.com/SMS/OTPValidate';
let returnData;
console.log('send sms otp', phone, otp);
const bodyData = {
  "mobileNumber" : phone,
  "otp" :  OTP
};
const response = await axios.post(url, bodyData);
console.log('send sms response', response);
if (response.status === 200) {
  returnData = {
    status: 'Success',
    ...response.data,
  };
} else {
  returnData = {
    status: 'Failure',
  };
}
};

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


  return (

      <NativeBaseProvider>
      <ScrollView showsVerticalScrollIndicator={false} px="3">
          <Box flex={1} bg="#fff">

          <TouchableOpacity>
           <View style={styles.normal}>
               <Text style={styles.text}>Seller Deliveries (Completed/Total)</Text>
           </View>
          </TouchableOpacity>

          <TouchableOpacity>
              <View style={styles.container}>
                 <Text style={styles.containerText}>Expected   </Text>
              </View>
          </TouchableOpacity>
    
          <TouchableOpacity>
              <View style={styles.container}>
                   <Text style={styles.containerText}>Delivered </Text>
              </View>
          </TouchableOpacity>
    
          <TouchableOpacity>
              <View style={styles.container}>
                  <Text style={styles.containerText}>Tagged </Text>
              </View>
          </TouchableOpacity>
    
          <TouchableOpacity>
              <View style={styles.container}>
                  <Text style={styles.containerText}>Not Handed Over </Text>
              </View>
          </TouchableOpacity>

          <TouchableOpacity>
           <View style={styles.normal}>
               <Text style={styles.text}>Seller Pickups ( {route.params.Forward} )</Text>
           </View>
          </TouchableOpacity>

          <TouchableOpacity>
              <View style={styles.container}>
                 <Text style={styles.containerText}>Expected                    {route.params.Forward}</Text>
              </View>
          </TouchableOpacity>
    
          <TouchableOpacity>
              <View style={styles.container}>
                   <Text style={styles.containerText}>Accepted                   {route.params.accepted}</Text>
              </View> 
          </TouchableOpacity>
    
          <TouchableOpacity>
              <View style={styles.container}>     
                  <Text style={styles.containerText}>Rejected                     {route.params.rejected} </Text>
              </View>
          </TouchableOpacity>
    
          <TouchableOpacity>
              <View style={styles.container}>
                  <Text style={styles.containerText}>Not Handed Over      0  </Text>
              </View>
          </TouchableOpacity>
          <HStack space={3} alignItems="center">
          <TextInput style={{backgroundColor:'#eee',margin:10}} 
              w={{
                 base: "45%",
                 md: "25%",
                }}
                onChangeText={newText => setName(newText)}
                
          placeholder="Enter Receiver Name"
          />
          <TextInput style={{backgroundColor:'#eee', color:'#000'}}
              w={{
                 base: "45%",
                 md: "25%",
                }}
                onChangeText={newPhone => setMobileNumber(newPhone)}
                defaultValue={route.params.phone}
          placeholder="Enter Receiver Mobile Number"
          />
          </HStack>
          <HStack space={5} alignItems="center" marginLeft={3} >
          <Button style={{backgroundColor:'#004aad', color:'#fff'}} onPress={() => generateOTP()}> Generate OTP</Button>
          <TextInput style={{backgroundColor:'#eee', color:'#000'}} 
              w={{
                 base: "55%",
                 md: "25%",
                }}
          
          placeholder="Enter OTP"
          />
          </HStack>
          <Center>
              <Button style={{backgroundColor:'#004aad', color:'#fff', marginTop:10}}  title="Submit"  onPress={() => submitForm()} >Submit</Button>
          </Center>
     
    
     

      {/* <Center>
            <Image 
              style={{
              width:150, 
              height:150
              }}
                   source={require('../file/image.png')} alt={"Logo Image"}
            />
            
           
           
        </Center> */}
      </Box>
      </ScrollView>
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



// import { 
//     ArrowForwardIcon, 
//     NativeBaseProvider, 
//     Box, 
//     Image,
//     Center,
//     Input
//   } from 'native-base';
  
//   import{
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View, 
//   ScrollView,
//   TextInput,
//   getPick,Alert} from 'react-native';
  
//   import axios from 'axios';
//   import { HStack } from 'native-base';
//   import { Button } from 'native-base';
//   import React, { useState, useEffect } from 'react';
//   import { useNavigation } from '@react-navigation/native';
//   import AsyncStorage from '@react-native-async-storage/async-storage';
//   import GetLocation from 'react-native-get-location';
//   import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
  
  
//   const POD = ({route}) => {
  
  
//     const [value, setValue] = useState('');
//     const DriverName = 'https://bked.logistiex.com/postRD';
//     const [name, setName] = useState("");
//     const [OTP, setOTP] = useState('');
//     const [phone, setPhone] = useState(route.params.phone);
//     //const [latitude, setLatitude] = useState(0);
//     //const [longitude , setLongitude] = useState(0);
//     const[data, setData] = React.useState({})
//     const navigation = useNavigation();
  
//     console.log(latitude, longitude);
//     console.log(route.params.phone);
  
//       const handleChange = (event) => {
//         console.log("input");
//         console.log(event.target.value);
//         setValue(event.target.value);
//     };
  
  
  
//     const generateOTP = () => {
//         const characters = phone;
//         const characterCount = characters.length;
//         let OTPvalue = '';
//         for (let i = 0; i < 4; i++) {
//           OTPvalue += characters[Math.floor(Math.random() * characterCount)];
//         }
//         setOTP(OTPvalue);
       
//         return OTPvalue;
//       };
//       const r = OTP;
//       console.log(r);
  
//   const sendSmsOtp = async (mobileNumber, otp) => {
//   const url = 'https://bked.logistiex.com/SMS/msg';
//   let returnData;
//   console.log('send sms otp', mobileNumber, otp);
//   const bodyData = {
//     "mobileNumber" : phone,
//     "otp" :  r
//   };
//   const response = await axios.post(url, bodyData);
//   console.log('send sms response', response);
//   if (response.status === 200) {
//     returnData = {
//       status: 'Success',
//       ...response.data,
//     };
//   } else {
//     returnData = {
//       status: 'Failure',
//     };
//   }
//   };
  
//   useEffect(() => {
//     const current_location = () => {
  
//       return GetLocation.getCurrentPosition({
//           enableHighAccuracy: true,
//           timeout: 10000,
//       })
//       .then(latestLocation => {
//           console.log('latest location '+JSON.stringify(latestLocation))
//           return latestLocation;
//       }).then(location => {
//           const currentLoc = { latitude: location.latitude, longitude: location.longitude };
//           setLatitude(location.latitude);
//           setLongitude(location.longitude);
//           return currentLoc;
//       }).catch(error => {
//           RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
//               interval: 10000,
//               fastInterval: 5000,
//           })
//           .then(status=>{
//               if(status)
//                   console.log('Location enabled');
//           }).catch(err=>{
//           })
//           return false;
//       })
//   };
  
//     current_location();
//   }, []);
  
  
  
//   const onnPress = () => {
//     generateOTP();
//     sendSmsOtp();
    
//   };
  
//   const submitForm = () => {
//     axios.post('https://bked.logistiex.com/SellerMainScreen/postRD', {
//       excepted:route.params.Forward,
//       accepted: route.params.accepted,
//       rejected:route.params.rejected,
//       nothandedOver:0,
//       feUserID: route.params.userId,
//       receivingDate : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
//       receivingTime: new Date().toLocaleString(),
//       latitude : latitude,
//       longitude : longitude,
//       ReceiverMobileNo : route.params.phone,
//       ReceiverName: name
      
//   })
//       .then(function (response) {
//           console.log(response.data, "hello");
//           alert('Your Data has submitted');
//       })
//       .catch(function (error) {
//           console.log(error);
//       });
//   }
  
  
//     return (
  
//         <NativeBaseProvider>
//         <ScrollView showsVerticalScrollIndicator={false} px="3">
//             <Box flex={1} bg="#fff">
  
//             <TouchableOpacity>
//              <View style={styles.normal}>
//                  <Text style={styles.text}>Seller Deliveries (Completed/Total)</Text>
//              </View>
//             </TouchableOpacity>
  
//             <TouchableOpacity>
//                 <View style={styles.container}>
//                    <Text style={styles.containerText}>Expected   </Text>
//                 </View>
//             </TouchableOpacity>
      
//             <TouchableOpacity>
//                 <View style={styles.container}>
//                      <Text style={styles.containerText}>Delivered </Text>
//                 </View>
//             </TouchableOpacity>
      
//             <TouchableOpacity>
//                 <View style={styles.container}>
//                     <Text style={styles.containerText}>Tagged </Text>
//                 </View>
//             </TouchableOpacity>
      
//             <TouchableOpacity>
//                 <View style={styles.container}>
//                     <Text style={styles.containerText}>Not Handed Over </Text>
//                 </View>
//             </TouchableOpacity>
  
//             <TouchableOpacity>
//              <View style={styles.normal}>
//                  <Text style={styles.text}>Seller Pickups  ( {route.params.Forward} )</Text>
//              </View>
//             </TouchableOpacity>
  
//             <TouchableOpacity>
//                 <View style={styles.container}>
//                    <Text style={styles.containerText}>Expected                    {route.params.Forward}</Text>
//                 </View>
//             </TouchableOpacity>
      
//             <TouchableOpacity>
//                 <View style={styles.container}>
//                      <Text style={styles.containerText}>Accepted                   {route.params.accepted}</Text>
//                 </View>
//             </TouchableOpacity>
      
//             <TouchableOpacity>
//                 <View style={styles.container}>
//                     <Text style={styles.containerText}>Rejected                     {route.params.rejected} </Text>
//                 </View>
//             </TouchableOpacity>
      
//             <TouchableOpacity>
//                 <View style={styles.container}>
//                     <Text style={styles.containerText}>Not Handed Over     0  </Text>
//                 </View>
//             </TouchableOpacity>
//             <HStack space={3} alignItems="center">
//             <Input style={{backgroundColor:'#eee',margin:10}} value={name}
//                 w={{
//                    base: "45%",
//                    md: "25%",
//                   }}
//             onChange={(e) =>setName(e.target.value)}
//             placeholder="Enter Receiver Name"
//             />
//             <Input style={{backgroundColor:'#eee', color:'#000'}} value={phone}
//                 w={{
//                    base: "45%",
//                    md: "25%",
//                   }}
//             onChange={(e) => setPhone(e)}
//             placeholder="Enter Receiver Mobile Number"
//             />
//             </HStack>
//             <HStack space={5} alignItems="center" marginLeft={3} >
//             <Button style={{backgroundColor:'#004aad', color:'#fff'}} onPress={() => onnPress()}> Generate OTP</Button>
//             <Input style={{backgroundColor:'#eee', color:'#000'}} 
//                 w={{
//                    base: "55%",
//                    md: "25%",
//                   }}
            
//             placeholder="Enter OTP"
//             />
//             </HStack>
//             <Center>
//                 <Button style={{backgroundColor:'#004aad', color:'#fff', marginTop:10}}  title="Submit"  onPress={() => submitForm()} >Submit</Button>
//             </Center>
       
      
       
  
//         {/* <Center>
//               <Image 
//                 style={{
//                 width:150, 
//                 height:150
//                 }}
//                      source={require('../file/image.png')} alt={"Logo Image"}
//               />
              
             
             
//           </Center> */}
//         </Box>
//         </ScrollView>
//       </NativeBaseProvider>
//     );
//   };
  
//   export default POD;
  
//   export const styles = StyleSheet.create({
  
  
//     normal:{
//         fontFamily:'open sans',
//         fontWeight:'normal',
//         color:'#eee',
//         marginTop:20,
//         marginLeft:10,
//         marginRight:10,
//         paddingTop:10,
//         paddingBottom:10,
//         backgroundColor:'#eee',
//         width: 'auto',
//         borderRadius:0
//     },
  
//     text:{
//       paddingLeft:20,
//       color:'#000',
//       fontWeight:'normal',
//       fontSize:18
//     },
//     container:{
//         fontFamily:'open sans',
//         fontWeight:'normal',
//         color:'#eee',
//         paddingTop:10,
//         paddingBottom:10,
//         // marginTop:27,
//         // marginLeft:10,
//         // marginRight:10,
//         // backgroundColor:'#eee',
//         width: 'auto',
//         borderWidth:1,
//         borderColor:'#eee'
  
//     },
  
//     containerText:{
  
//         paddingLeft:30,
//         color:'#000',
//         fontSize:15
  
  
//     },
//     otp:{
//         backgroundColor:'#004aad', 
//         color:'#000',
//         marginTop:5,
//         borderRadius:10
       
//     }
//   })