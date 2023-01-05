/* eslint-disable prettier/prettier */
import { NativeBaseProvider, Image, Box, Fab, Icon, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import{Text,View, ScrollView, Vibration, ToastAndroid} from 'react-native';
import { Center } from "native-base";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { openDatabase } from "react-native-sqlite-storage";
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from "@react-native-community/netinfo";
import RNBeep from 'react-native-a-beep';

const db = openDatabase({
  name: "rn_sqlite",
});

const ShipmentBarcode = ({route}) => {
    const [barcodeValue,setBarcodeValue] = useState("");
    const [packageValue,setpackageValue] = useState("");
    const [otp,setOtp] = useState('');
    const [flag, setflag] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [pending, setPending] = useState(0)
    const [expected, setExpected] = useState(0)
    const [newaccepted, setnewAccepted] = useState(0)
    const [newrejected, setnewRejected] = useState(0);  
    const [barcode, setBarcode] = useState("");
    const [len, setLen] = useState(0);
    const [data, setData] = useState();
    
    const getCategories = (data) => {	
      db.transaction(txn => {	
        txn.executeSql(	
          `SELECT * FROM categories WHERE clientShipmentReferenceNumber = ? AND ScanStatus = ? `,	
          [data, 0],	
          (sqlTxn, res) => {	
            console.log("categories retrieved successfully", res.rows.length);	
            setLen(res.rows.length);	
            if(!res.rows.length){
              alert('You are scanning wrong product, please check.');	
            }
          },	
          error => {	
            console.log("error on getting categories " + error.message);	
          },	
        );	
      });	
    };

    const updateCategories = (data) => {	
      db.transaction((tx) => {	
        tx.executeSql(	
          'UPDATE categories set ScanStatus=? where clientShipmentReferenceNumber=?',	
          [1, data],	
          (tx, results) => {	
            console.log('Results', results.rowsAffected);	
          }	
        );	
      });	
    }
    
    const updateCategories1 = (data) => {	
      db.transaction((tx) => {	
        tx.executeSql(	
          'UPDATE categories set ScanStatus=?, UploadStatus=? where clientShipmentReferenceNumber=?',	
          [1, 1, data],	
          (tx, results) => {	
            console.log('Results', results.rowsAffected);	
          }	
        );	
      });	
    }	
    const onSuccess = e => {	
      console.log(e.data, 'barcode');	
      getCategories(e.data);	
      setBarcode(e.data);	
    }

    useEffect(() => {	
      if (len) {	
        ContinueHandle();	
        Vibration.vibrate(100);	
        RNBeep.beep();
        ToastAndroid.show("OK",ToastAndroid.SHORT);
        setLen(false);	
        updateCategories(barcode);	
      } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [len]);
  

    const navigation = useNavigation();
    const [count, setcount] = useState(0);

    const ContinueHandle = () => {	
      const getUser = async () => {	
        try {	
          const savedUser = await AsyncStorage.getItem("user");	
          const currentUser = JSON.parse(savedUser);	
          await AsyncStorage.setItem("user", JSON.stringify({	
            Accepted: currentUser.Accepted + 1,	
            Rejected: currentUser.Rejected	
          }));	
          setnewAccepted(1 + currentUser.Accepted);	
          setnewRejected(currentUser.Rejected);	
        } catch (error) {	
          console.log(error);	
        }	
      };	
      getUser();	
    }
    
    useEffect(() => {	
      async function userdata() {	
        const savedUser = await AsyncStorage.getItem("user");	
        const currentUser = JSON.parse(savedUser);	
        setnewAccepted(currentUser.Accepted);	
        setnewRejected(currentUser.Rejected);	
      }	
      userdata();	
    }, [newaccepted, newrejected]);

    const handleSync = () => {	
      const unsubscribe = NetInfo.addEventListener(state => {	
        if (!state.isConnected) {	
          alert('check net connection');	
          return;	
        }	
        db.transaction((tx) => {	
          tx.executeSql(	
            'SELECT * FROM categories where ScanStatus = ? AND UploadStatus = ?',	
            [1, 0],	
            (tx, results) => {	
              var len = results.rows.length;	
              if (len > 0) {	
                let res = results.rows.item(0);	
                console.log(res, 'tanmay')	
                axios.post('https://bked.logistiex.com/SellerMainScreen/postSPS', {	
                  clientShipmentReferenceNumber: res.clientShipmentReferenceNumber,	
                  feUserID: route.params.userId,	
                  isAccepted: 'false',	
                  rejectionReason: 'null',	
                  consignorCode: res.consignorCode,	
                  pickupTime: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),	
                  latitude: 0,	
                  longitude: 0,	
                  packagingId: 'ss',	
                  packageingStatus: 1,	
                  PRSNumber: res.PRSNumber	
                })	
                  .then(function (response) {	
                    console.log(response.data, "hello");	
                    updateCategories1(res.clientShipmentReferenceNumber);	
                    alert('Data send on Server');	
                  })	
                  .catch(function (error) {	
                    console.log(error);	
                  });	
              } else {	
                alert('No data found');	
              }	
            }	
          );	
        });	
      });	
      // Unsubscribe	
      unsubscribe();	
    }
  
  return (
    <NativeBaseProvider>
      <ScrollView style={{paddingTop: 20, paddingBottom: 50}} showsVerticalScrollIndicator={false}>
        <QRCodeScanner
          onRead={onSuccess}
          reactivate={true}
          reactivateTimeout={3000}
          flashMode={RNCamera.Constants.FlashMode.off}
          containerStyle={{width: '100%', alignSelf: 'center', backgroundColor: 'white'}}
          cameraStyle={{width: '90%', alignSelf: 'center'}}
          topContent={
            <View><Text>okay</Text></View>
          }
        />
        <View>
          <View style={{backgroundColor: 'white'}}>
            <View style={{alignItems: 'center', marginTop: 15}}>

              <View style={{backgroundColor: 'lightgray', padding: 10, flexDirection: 'row', justifyContent: 'space-between', width: '90%', borderRadius: 5}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>shipment ID: </Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{barcode}</Text>
              </View>

              <Button onPress={()=>navigation.navigate('reject',{
                barcode : barcode,	
                PRSNumber : route.params.PRSNumber,	
                consignorCode : route.params.consignorCode,
                userId : route.params.userId,
                packagingId : route.params.packagingId
              })} w="90%" size="lg" bg="#004aad" mb={4} mt={4}>Reject Shipment</Button>

              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Expected</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{route.params.Forward}</Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Accepted</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{newaccepted}</Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>     
                <Text style={{fontSize: 18, fontWeight: '500'}}>Rejected</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{newrejected}</Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: 'lightgray', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Not Handed Over</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{0}</Text>
              </View>
            </View>
          </View>

          <Center>
            <Button onPress={()=>navigation.navigate('POD',{
              Forward : route.params.Forward,
              accepted : newaccepted,
              rejected : newrejected,
              phone : route.params.phone,
              userId : route.params.userId,
            })} w="90%" size="lg" bg="#004aad">Continue</Button>
          </Center>
          <Center>
            <Image 
              style={{
              width:150, 
              height:100
              }}
              source={require('../../assets/image.png')} alt={"Logo Image"}
            />
          </Center>
        </View>
        <Fab onPress={() => handleSync()} position="absolute" size="sm" style={{backgroundColor: '#004aad'}} icon={<Icon color="white" as={<MaterialIcons name="sync" />} size="sm" />} />
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ShipmentBarcode;

