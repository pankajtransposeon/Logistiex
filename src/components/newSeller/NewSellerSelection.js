/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Image, Center,NativeBaseProvider, Fab, Icon, Button, Box, Heading, Modal } from 'native-base';
import{StyleSheet,Text,TouchableOpacity,View, ScrollView, TextInput,getPick, Alert, TouchableWithoutFeedbackBase,ToastAndroid} from 'react-native';
import Lottie from 'lottie-react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import call from 'react-native-phone-call';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Pie from 'react-native-pie'	
import { openDatabase } from "react-native-sqlite-storage";	
const db = openDatabase({	
  name: "rn_sqlite",	
});	
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PieChart from 'react-native-pie-chart';

const NewSellerSelection = ({route}) => {
  const [barcodeValue,setBarcodeValue] = useState("");
  const shipmentData = `https://bked.logistiex.com/SellerMainScreen/getSellerDetails/${route.params.paramKey}`;	
  const [acc, setAcc] = useState(0);	
  const [pending, setPending] = useState(route.params.Forward);	
  const [reject, setReject] = useState(0);
  const [data,setData] = useState([]);
  const [order, setOrder] = useState([]);
  const [newdata, setnewdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState(route.params.phone);
  const [type,setType] = useState('');
  const [DropDownValue, setDropDownValue] = useState(null);
  const [CloseData, setCloseData] = useState([]);
  const [NotAttemptData, setNotAttemptData] = useState([]);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [buttonColor, setButtonColor] = useState('#004aad');
  const [selected, setSelected]=useState(null)
  const [initialValue, setInitialValue] = useState('blue');

  const DisplayData = async() => {
     closePickup11();
  };
  const notPicked = () => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE SellerMainScreenDetails SET status="notPicked" , rejectedReason=? WHERE status IS Null', [DropDownValue], (tx1, results) => {
              let temp = [];
              // console.log("Not Picked Reason",DropDownValue);
              // console.log('Results',results.rowsAffected);
              // console.log(results);
              // if (results.rowsAffected > 0) {
              //   console.log('notPicked done');
              // } else {
              //   console.log('failed to add notPicked item locally');
              // }
              console.log(results.rows.length);
              for (let i = 0; i < results.rows.length; ++ i) {
                  temp.push(results.rows.item(i));
              }
              // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
          });
      });
  }
  const  closePickup11 = () => {
    db.transaction(tx => {
        tx.executeSql('SELECT * FROM ClosePickupReasons', [], (tx1, results) => {
            let temp = [];
            console.log(results.rows.length);
            for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
            }
            // console.log('Data from Local Database CPR: \n ', temp);
            setCloseData(temp);
        });
    });
};
  const DisplayData2 = async() => {
    NotAttemptReasons11();
  }

  const NotAttemptReasons11 = () => {
    db.transaction(tx => {
        tx.executeSql('SELECT * FROM NotAttemptReasons', [], (tx1, results) => {
            let temp = [];
            // console.log(results.rows.length);
            for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
            }
            setNotAttemptData(temp);
            // console.log('Data from Local Database  NAR: \n ', JSON.stringify(temp,null,4));
        });
    });
};

  useEffect(() => {
    DisplayData();   
  }, []);

  useEffect(() => {
    DisplayData2();   
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      loadSellerPickupDetails();

    });
    return unsubscribe;
  }, [navigation]);

//   useEffect(() => {
//     (async () => {
//         loadSellerPickupDetails();
//     })();
// }, []);

const sync11 = () => {
  loadSellerPickupDetails();

};

const loadSellerPickupDetails = () => {
  setIsLoading(!isLoading);
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM SellerMainScreenDetails where consignorCode=? AND status="accepted"', [route.params.consignorCode], (tx1, results) => {
        // let temp = [];
        console.log(results.rows.length);
        if (results.rows.length > 0){
        setAcc(results.rows.length);
        console.log(acc);
        setPending(route.params.Forward - results.rows.length);
        console.log(pending);

        }
        setIsLoading(false);
        // ToastAndroid.show("Loading Successfull",ToastAndroid.SHORT);
        // for (let i = 0; i < results.rows.length; ++i) {
        //     temp.push(results.rows.item(i));
        // }
        // console.log("Data from Local Database : \n ", JSON.stringify(temp, null, 4));
        // setData(temp);
    });
  });
  };



  let r = [];	
    useEffect(() => 	
     {	
      (async() => {	
        db.transaction((tx) => {	
          tx.executeSql(	
            'SELECT * FROM categories where ScanStatus = ?',	
            [1],	
            (tx, results) => {	
              var len = results.rows.length;	
              // console.log(len);	
              // setAcc(len);	
              setPending(route.params.Forward - len);	
            }	
          );	
        });	
      }) ();	
     }	
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[]);
 	

    const loadDetails = () => {
      // setIsLoading(!isLoading);
      db.transaction((tx) => {
          tx.executeSql('SELECT * FROM SellerDetails11', [], (tx1, results) => {
              // ToastAndroid.show("Loading...", ToastAndroid.SHORT);
              let temp = [];
              console.log(results.rows.length);
              for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
                  console.log(results.rows.item(i).consignorName);
                  // var address121 = results.rows.item(i).consignorAddress;
                  // var address_json = JSON.parse(address121);
                  // console.log(typeof (address_json));
                  // console.log("Address from local db : " + address_json.consignorAddress1 + " " + address_json.consignorAddress2);
                  // ToastAndroid.show('consignorName:' + results.rows.item(i).consignorName + "\n" + 'PRSNumber : ' + results.rows.item(i).PRSNumber, ToastAndroid.SHORT);
              }
              console.log("Data from Local Database : \n ", JSON.stringify(temp, null, 4));
              setData(temp);
          //   setIsLoading(false);
          });
      });
  };


  const toggleLoading = () => {
    setIsLoading(!isLoading);
      (async() => {
        await axios.get(shipmentData)
        .then((res) => {
          setData(res.data)
    }, (error) => {
        alert(error);
    });    
    }) ();
    setIsLoading ? navigation.navigate('loading1') : null;
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('NewSellerSelection');
      }, 3000);
    };

  const triggerCall=() =>{
    const args = {
      number: phone,
      prompt: false, }
      call(args).catch(console.error);
  };

  var TotalpickUp = 0;
  var CompletePickUp = 0;
  let net = TotalpickUp - CompletePickUp;

  useEffect(() => {
    let addresss = "";
    if(route && route.params){
      addresss += route.params.consignorAddress1;
      addresss += " ";
      addresss += route.params.consignorAddress2;
      addresss += " ";
      addresss += route.params.consignorCity;
      addresss += " ";
      addresss += route.params.consignorPincode
    } 
     setType(addresss);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleButtonPress(item) {
    if(item=="Could Not Attempt"){
      setModalVisible2(true)
      setModalVisible(false)
    }
    else{
      setDropDownValue(item);
    }
    // setModalVisible(false);
  }
  function handleButtonPress2(item) {
    setDropDownValue(item);
  }

  

return (
  <NativeBaseProvider >
  <View>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Close Pickup Reason Code</Modal.Header>
          <Modal.Body>
          {CloseData.map((d,index) => (
            <Button key={d.pickupFailureReasonID} flex="1" mt={2} marginBottom={1.5} 
             marginTop={1.5} style={{backgroundColor: d.pickupFailureReasonName === DropDownValue ? "#6666FF":"#C8C8C8"}}  title={d.pickupFailureReasonName} onPress={() => handleButtonPress(d.pickupFailureReasonName)} >
            <Text style={{color:DropDownValue==d.pickupFailureReasonName?'white':'black'}}>{d.pickupFailureReasonName}</Text></Button>
            ))}
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} onPress={() => {notPicked(); setModalVisible(false);}} >
            Submit</Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={modalVisible2} onClose={() => setModalVisible2(false)} size="lg">
      <Modal.Content maxWidth="350">
      <Modal.CloseButton />
      <Modal.Header>Could Not Attempt Reason</Modal.Header>
      <Modal.Body>
        {(NotAttemptData) &&
        NotAttemptData.map((d,index) => (
          <Button key={d._id} flex="1" mt={2}  marginBottom={1.5} marginTop={1.5} style={{backgroundColor: d.reasonName === DropDownValue ? "#6666FF":"#C8C8C8"}} title={d.reasonName} onPress={() => handleButtonPress2(d.reasonName)} >
          <Text style={{color:d.reasonName==DropDownValue?'white':'black'}}>{d.reasonName}</Text></Button>
        ))}
        <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5}  onPress={() => {notPicked(); setModalVisible2(false);}} >
         Submit</Button>
         <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5}  onPress={() => {setModalVisible(true), setModalVisible2(false)}} >
         Back</Button>
        </Modal.Body>
        </Modal.Content>
      </Modal>

    <View style={{width: '100%', justifyContent: 'center', flexDirection: 'row', marginTop: 30}}>
      <PieChart
        widthAndHeight={160}
        series={[pending,acc]}
        sliceColor={['#F44336', '#4CAF50' ]}
        doughnut={true}
        coverRadius={0.6}
        coverFill={'#FFF'}
      />
    </View>
    <View style={{flexDirection: 'row', width: '85%', marginTop: 30, marginBottom: 10, alignSelf: 'center', justifyContent: 'space-between'}}>
      <View style={{backgroundColor: '#4CAF50', width: '48%', padding: 10, borderRadius: 10}}><Text style={{color:'white', alignSelf: 'center'}}>{acc}</Text></View>
      <View style={{backgroundColor: '#F44336', width: '48%', padding: 10, borderRadius: 10}}><Text style={{color:'white', alignSelf: 'center'}}>{pending}</Text></View>
    </View>
      <View style={styles.containter}>
        <ScrollView style={styles.homepage} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>       
        <ScrollView>
          <View style={styles.containter}>
            <View  style={styles.mainbox}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 15}}>
                <Text style={{fontWeight: '500', fontSize: 18, color: 'black'}}>Seller Name</Text>
                <Text style={{fontWeight: '500', fontSize: 18, color: 'gray'}}>{route.params.consignorName}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 15, paddingBottom: 15}}>
                <Text style={{fontWeight: '500', fontSize: 18, color: 'black'}}>Address</Text>
                <Text style={{fontWeight: '500', fontSize: 14, color: 'gray'}}>{type}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 15, paddingBottom: 15, borderTopColor: 'lightgray', borderTopWidth: 1}}>
                <View style={styles.outer1}><Text style={{color:'#6DB1E1',fontWeight:'700'}} onPress={triggerCall}>Call Seller</Text></View>
                <TouchableOpacity onPress={() => navigation.navigate('MapScreen', {
                    address : type,
                    latitude : 0,
                    longitude : 0
                  })}
                >
                  <View style={styles.outer1}><Text style={{color:'#6DB1E1',fontWeight:'700'}}>Get Direction</Text></View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
         </ScrollView>
         <View style={{flexDirection: 'row', width: '92%', justifyContent: 'space-between', marginTop:10, alignSelf: 'center'}}>
         <Button leftIcon={<Icon color="white" as={<MaterialIcons name="close-circle-outline" />} size="sm" />} onPress={() => setModalVisible(true)} style={{backgroundColor: '#004aad', width: '48%'}}>
          Close Pickup
         </Button>
          <Button style={{backgroundColor: '#004aad', width: '50%', alignSelf: 'center'}} leftIcon={<Icon color="white" as={<MaterialIcons name="barcode-scan" />} size="sm" />} 
            onPress={()=>navigation.navigate('ShipmentBarcode',{
              Forward : route.params.Forward,
              PRSNumber : route.params.PRSNumber,
              consignorCode : route.params.consignorCode,
              userId : route.params.userId,
              phone : route.params.phone,
              packagingId : route.params.packagingId
              // TotalpickUp : newdata[0].totalPickups
            })}
          >
            Scan
          </Button>
        </View>
  </ScrollView>
  </View>
  <Center>
    <Image style={{nwidth:150, height:150}} source={require('../../assets/image.png')} alt={"Logo Image"} />
  </Center>
</View>
{/* <Fab onPress={()=>sync11()} position="absolute" size="sm" style={{backgroundColor: '#004aad'}} icon={<Icon color="white" as={<MaterialIcons name="sync" />} size="sm" />} /> */}
{/* {isLoading ? (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              backgroundColor: 'rgba(0,0,0,0.65)',
            },
          ]}>
          <Text style={{color: 'white'}}>Loading Please Wait...</Text>
          <Lottie
            source={require('../../assets/loading11.json')}
            autoPlay
            loop
            speed={1}
            //   progress={animationProgress.current}
          />
          <ProgressBar width={70} />
        </View>
      ) : null} */}
</NativeBaseProvider>
);
};

export default NewSellerSelection;
export const styles = StyleSheet.create({

scanbtn:{
  width:140,
  height:50,
  color:'white',
  borderBottomColor:'red',
  borderBottomWidth:2,
  alignItems:'center',
  justifyContent:'center',
  backgroundColor:'white'
},
scanbtn2:{
  width:140,
  height:50,
  color:'white',
  borderBottomColor:'green',
  borderBottomWidth:2,
  // color:'white',
  marginLeft:2,
  alignItems:'center',
  justifyContent:'center',
  backgroundColor:'white'
},
iconbar:{
  marginTop:10,
  marginLeft:30,
  flexDirection:'row',
  alignItems:'center',
  width:'100%',
  // backgroundColor:'green'
},
containter:{
  marginTop:0,
  marginVertical:0,
  alignSelf:'center',
},
searchbar:{
  width:280
},
normal:{
  fontFamily:'open sans',
  fontWeight:'normal',
  fontSize:20,
  color:'#eee',
  marginTop:27,
  paddingTop:15,
  marginLeft:10,
  marginRight:10,
  paddingBottom:15,
  backgroundColor:'#eee',
  width: 'auto',
  borderRadius:0
  },
text:{
  paddingLeft:30,
  color:'#000',
  fontWeight:'bold',
  fontSize:18
},
text1:{
  alignSelf: 'center',
  color:'#fff',
  fontWeight:'bold',
  fontSize:18
},
bt1:{
  fontFamily :'open sans',
  fontSize:15,
  lineHeight:10,
  marginTop:30,
  paddingTop:10,
  paddingBottom:10,
  backgroundColor:'#004aad',
  width:100,
  borderRadius:10,
  paddingLeft:0,
  marginLeft:0
},
bt2:{
  fontFamily:'open sans',
  fontSize:15,
  lineHeight:10,
  marginTop:-44,
  paddingTop:10,
  paddingBottom:10,
  backgroundColor:'#004aad',
  width:100,
  borderRadius:10,
  paddingLeft:0,
  marginLeft:110
} , 
bt3:{
  fontFamily:'open sans',
  color:'#000',
  fontWeight:'bold',
  fontSize:15,
  lineHeight:10,
  marginTop:-44,
  paddingTop:10,
  paddingBottom:10,
  backgroundColor:'#004aad',
  width:100,
  borderRadius:10,
  paddingLeft:0,
  marginLeft:220
},
// containter:{
//   marginTop:30,
//   marginVertical:0,
//   alignSelf:'center',
// },
mainbox:{
  width: 340,
  height:'auto',
  backgroundColor:'white',
  alignSelf:'center',
  marginVertical:20,
  borderRadius: 5,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.44,
  shadowRadius: 10.32,
  elevation: 1,
},
innerup:{
  flexDirection:'row',
  justifyContent:'space-around',
  padding:10,
},
innerdown:{
  flexDirection:'row',
  justifyContent:'space-between',
  paddingVertical:10
},
outerdown:{
  flexDirection:'row',
  justifyContent:'space-between',
  paddingVertical:15,
  borderTopWidth:2,
  borderColor: '#F4F4F4',
},
outer1:{
  paddingLeft:10,
  paddingRight:10
},
fontvalue:{
  padding:10,
  fontWeight:'700',
  color : "black"
},
container69: { 
  alignItems: 'center', 
  justifyContent: 'center', 
  height: 250
},
gauge: {
  position: 'absolute',
  width: 100,
  height: 160,
  alignItems: 'center',
  justifyContent: 'center',
},
gaugeText: {
  backgroundColor: 'transparent',
  color: '#000',
  fontSize: 24,
},
modalContent: {
  flex:0.7,
  justifyContent:'center',
  height:'50%',
  width:'85%',
  backgroundColor:'white',
  
  borderRadius:20,
  shadowOpacity: 0.3,
  shadowRadius: 10,
  
  elevation: 5,
  marginLeft:28,
  marginTop:175,
},
closeButton: {
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor:'rgba(0,0,0,0.3)',
  borderRadius:100,
  margin:5.5,
  color:'rgba(0,0,0,1)'
},
});
