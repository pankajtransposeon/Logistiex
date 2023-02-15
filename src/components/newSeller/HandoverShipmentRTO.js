/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { NativeBaseProvider, Image, Box, Fab, Icon, Button ,Alert, Modal, Input} from 'native-base';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Text,View, ScrollView, Vibration, ToastAndroid,TouchableOpacity,StyleSheet} from 'react-native';
import { Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { openDatabase } from 'react-native-sqlite-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import RNBeep from 'react-native-a-beep';
import { Picker } from '@react-native-picker/picker';
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { backgroundColor, borderColor, height, marginTop, style } from 'styled-system';
import { Console } from 'console';
import { truncate } from 'fs/promises';

const db = openDatabase({
  name: 'rn_sqlite',
});

const HandoverShipmentRTO = ({route}) => {
    // const [barcodeValue,setBarcodeValue] = useState('');
    // const [packageValue,setpackageValue] = useState('');
    // const [otp,setOtp] = useState('');
    // const [flag, setflag] = useState(false);
    // const [showModal, setShowModal] = useState(false);
    // const [refresh, setRefresh] = useState(false);
    // const [pending, setPending] = useState(0);
    // const [expected, setExpected] = useState(0);
    // const [newaccepted, setnewAccepted] = useState(0);
    // const [newrejected, setnewRejected] = useState(0);
    const [barcode, setBarcode] = useState('');
    const [len, setLen] = useState(0);
    // const [DropDownValue, setDropDownValue] = useState(null);
    // const [rejectedData, setRejectedData] = useState([]);
    // const RejectReason = 'https://bked.logistiex.com/ADupdatePrams/getUSER';
    // const [latitude, setLatitude] = useState(0);
    // const [longitude , setLongitude] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [bagId, setBagId] = useState('');
    const [bagIdNo, setBagIdNo] = useState(1);
    const [showCloseBagModal, setShowCloseBagModal] = useState(false);
    const [bagSeal, setBagSeal] = useState('');
    const [data, setData] = useState([]);
    const [acceptedArray,setAcceptedArray] = useState([]);
    const [sellerCode11,setCode11] = useState('');
    const [sellerName11,setSellerName11] = useState('');
    const [sellerNoOfShipment,setSellerNoOfShipment] = useState(0);
    const [scanprogressRD,setScanProgressRD] = useState(0);
    const [sellerBagOpen11,setSellerbagOpen11] = useState('Yes');

    useEffect(() => {
      setBagId();
    }, [bagId]);

    // useEffect(() => {
    //       updateDetails2();
    //       console.log("fdfdd "+barcode);
    // });

    function CloseBag(){
      console.log(bagId);
      console.log(bagSeal);
      setBagId('');
      setBagIdNo(bagIdNo + 1);
    }

      const updateDetails2 = () => {
        console.log('scan 4545454');

        db.transaction((tx) => {
            tx.executeSql('UPDATE SellerMainScreenDetailsRTO SET status="accepted" WHERE consignorCode=?', [barcode], (tx1, results) => {
                let temp = [];
                console.log('Results',results.rowsAffected);
                console.log(results);

                if (results.rowsAffected > 0) {
                  console.log(barcode + 'accepted');
                  ToastAndroid.show(barcode + ' Accepted',ToastAndroid.SHORT);

                } else {
                  console.log(barcode + 'not accepted');
                }
                console.log(results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
                console.log('Data updated: \n ', JSON.stringify(temp, null, 4));
                // viewDetails2();
            });
        });
      };


      const loadDetails = (datas) => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SyncSellerPickUp WHERE consignorCode=?', [datas], (tx1, results) => {
                let temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
                setData(temp);
                console.log(temp, 'datatanmay');
            });
        });
    };

    const getCategories = (data) => {
      db.transaction(txn => {
        txn.executeSql(
          'SELECT * FROM SellerMainScreenDetailsRTO WHERE consignorCode = ? AND status = \'Rejected\' ',
          [data],
          (sqlTxn, res) => {
            console.log('categories retrieved successfully', res.rows.length);
            if (!res.rows.length){
              alert('You are scanning wrong product, please check.');
            } else {
                setBarcode(() => data);
                Vibration.vibrate(100);
                RNBeep.beep();
                updateDetails2();
                loadDetails(data);
            }
          },
          error => {
            console.log('error on getting categories ' + error.message);
          },
        );
      });
    };


    const onSuccess = e => {
      console.log(e.data, 'barcode');
      getCategories(e.data);
      // displayConsignorDetails11();
    };


    const onSuccess11 = e => {
      Vibration.vibrate(100);
      RNBeep.beep();
      console.log(e.data, 'sealID');
      getCategories(e.data);
      setBagSeal(e.data);
    };

    const UpdateShipmentList = () => {
      // console.log('ram', acceptedArray.toString())
      db.transaction(txn => {
        txn.executeSql('UPDATE SyncSellerPickUp SET ShipmentListArray=? WHERE consignorCode=?', [
            acceptedArray.toString(),
            barcode
        ], (sqlTxn, _res) => {
            setModalVisible(false)

        }, error => {
            console.log('error on adding data ' + error.message);
        },);
    });
    }

    const bagopenCloseHandler = () => {
      db.transaction((tx) => {
        tx.executeSql('UPDATE SyncSellerPickUp SET BagOpenClose="open" WHERE consignorCode=?', [barcode], (tx1, results) => {
          setAcceptedArray(prevarr => [...prevarr, barcode.toString()]);
          UpdateShipmentList();
        },
        error => {
          console.log('error on adding data ' + error.message);
      },);
        
    });
    }


    // useEffect(() => {
    //   `displayConsignorDetails11`();
    // }, []);


  //   const displayConsignorDetails11 = () => {
  //     db.transaction(tx => {
  //         tx.executeSql('SELECT * FROM SyncSellerPickUp where consignorCode= ?', [barcode], (tx1, results) => {
  //             // let temp = [];
  //             console.log(results.rows.length);
  //             for (let i = 0; i < results.rows.length; ++i) {
  //                 setCode11(results.rows.item(i).consignorCode);
  //                 setSellerName11(results.rows.item(i).consignorName);
  //                 setScanProgressRD(results.rows.item(i).ReverseDeliveries);
  //                 console.log(results.rows.item(i).consignorName);

  //             }
          
  //         });
  //     });
  // };


    const navigation = useNavigation();
    const [count, setcount] = useState(0);


  return (
    <NativeBaseProvider>
      <Modal isOpen={showCloseBagModal} onClose={() => setShowCloseBagModal(false)} size="lg">
        <Modal.Content maxWidth="350" >
          <Modal.CloseButton />
          <Modal.Header>Close Bag</Modal.Header>
          <Modal.Body>
          <QRCodeScanner
          onRead={onSuccess11}
          reactivate={true}
          // showMarker={true}
          reactivateTimeout={2000}
          flashMode={RNCamera.Constants.FlashMode.off}
          ref={(node) => { this.scanner = node; }}
          containerStyle={{ height:116,marginBottom:'55%' }}
          cameraStyle={{ height: 90, marginTop: 95,marginBottom:'15%', width: 289, alignSelf: 'center', justifyContent: 'center' }}
          // cameraProps={{ ratio:'1:2' }}
          // containerStyle={{width: '100%', alignSelf: 'center', backgroundColor: 'white'}}
          // cameraStyle={{width: '10%',alignSelf: 'center'}}
          // topContent={
          //   <View><Text>Scan Bag Seal</Text></View>
          // }
          // style={{
          //   // flex: 1,
          //   // width: '100%',
          // }}
        /> {'\n'}
        <Input placeholder="Enter Bag Seal" size="md" value={bagSeal} onChangeText={(text)=>setBagSeal(text)}  style={{

         width: 290,
      backgroundColor:'white',
      }} />
            {/* {'\n'}
            <Input placeholder="Enter Bag Seal" size="md" onChangeText={(text)=>setBagSeal(text)} /> */}
            <Button flex="1" mt={2} bg="#004aad" onPress={() => { CloseBag(); setShowCloseBagModal(false); }}>Submit</Button>
            <View style={{alignItems: 'center', marginTop: 15}}>
              <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '500', color: 'black'}}>Seller Code</Text>
                {
                    data && data.length ? (
                        <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{data[0].consignorCode}</Text>
                    ):null
                }
                {/* <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{sellerCode11}</Text> */}

              </View>
              <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>Seller Name</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{data[0].consignorName}</Text>
                  ):null
                }
              </View>
              <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 1, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>Number of Shipments</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{data[0].ForwardPickups}</Text>
                  ):null
                }
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header />
          <Modal.Body>
          <Text style={{fontWeight:'bold', color:'black'}}>The Seller has {
                  data && data.length ? (
                    <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>{data[0].ForwardPickups}</Text>
                  ):null
                } shipments. Would you like to open the Bag?</Text>
          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
            <Button onPress={() => bagopenCloseHandler()} w="48%" size="lg" bg="#004aad" >Yes</Button>
            <Button onPress={() => setModalVisible(false)} w="48%" size="lg" bg="#004aad">No</Button>
          </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>

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
                <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>SHIPMENT ID </Text>
                <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>{barcode}</Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>Seller Code</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>{data[0].consignorCode}</Text>
                  ):null
                }
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>Seller Name</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>{data[0].consignorName}</Text>
                  ): null
                }
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 13, fontWeight: '500', color: 'black'}}>Shipment scan Progress for </Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>1/{data[0].ForwardPickups}</Text>
                  ):null
                }
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>Bags Open</Text>
                {data && data.length && data[0].BagOpenClose === "close"? (
                  
                    <TouchableOpacity style={{backgroundColor: 'lightgray', padding: 5, borderRadius: 3}} onPress={() => setModalVisible(true)} >
                    <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}>Yes/No</Text>
                    </TouchableOpacity>
                  
                ):(
                  <Text style={{fontSize: 18, fontWeight: '500', color: 'black'}}></Text>
                )}
              </View>
            </View>
          </View>
          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
            <Button w="48%" size="lg" bg="#004aad" onPress={()=>setShowCloseBagModal(true)}>Close Bag</Button>
            <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('OpenBags')}>Close Handover</Button>
          </View>
          <Center>
            <Image
              style={{
              width:150,
              height:100,
              }}
              source={require('../../assets/image.png')} alt={'Logo Image'}
            />
          </Center>
        </View>
        {/* <Fab onPress={() => handleSync()} position="absolute" size="sm" style={{backgroundColor: '#004aad'}} icon={<Icon color="white" as={<MaterialIcons name="sync" />} size="sm" />} /> */}
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default HandoverShipmentRTO;

export const styles = StyleSheet.create({
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
    borderRadius:0,
  },
  container:{
   flexDirection:'row',
  },
  text:{
    color:'#000',
    fontWeight:'bold',
    fontSize:18,
    textAlign:'center',
  },
  main1:{
    backgroundColor:'#004aad',
    fontFamily:'open sans',
    fontWeight:'normal',
    fontSize:20,
    marginTop:27,
    paddingTop:15,
    marginLeft:10,
    marginRight:10,
    paddingBottom:15,
    width: 'auto',
    borderRadius:20,
  },
  textbox1:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:18,
    width:'auto',
    flexDirection: 'column',
    textAlign:'center',
  },

  textbtn:{
    alignSelf: 'center',
    color:'#fff',
    fontWeight:'bold',
    fontSize:18,
  },
  btn:{
    fontFamily:'open sans',
    fontSize:15,
    lineHeight:10,
    marginTop:80,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#004aad',
    width:100,
    borderRadius:10,
    paddingLeft:0,
    marginLeft:60,
  },
  bt3: {
    fontFamily: 'open sans',
    color:'#fff',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 10,
    marginTop: 10,
    backgroundColor: '#004aad',
    width: 'auto',
    borderRadius: 10,
    paddingLeft: 0,
    marginLeft: 10,
    marginRight:15,
    // width:'95%',
    // marginTop:60,
  },
  picker:{
    color:'white',
  },
  pickerItem: {
    fontSize: 20,
    height: 50,
    color: '#ffffff',
    backgroundColor: '#2196f3',
    textAlign: 'center',
    margin: 10,
    borderRadius: 10,
  },
  modalContent: {
    flex:0.57,
    justifyContent:'center',
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
    color:'rgba(0,0,0,1)',
    alignContent:'center',

  },

  });
