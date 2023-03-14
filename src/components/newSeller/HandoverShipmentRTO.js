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
    // const RejectReason = 'https://bkedtest.logistiex.com/ADupdatePrams/getUSER';
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
    const currentDate = new Date().toISOString().slice(0, 10);

    const [acceptedItemData, setAcceptedItemData] = useState({});
    // const navigation = useNavigation();
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        loadAcceptedItemData12();
      });
      return unsubscribe;
    }, [navigation]);

    const buttonColor =
     data && data.length  && data[0].consignorCode && acceptedItemData[data[0].consignorCode] && acceptedItemData[data[0].consignorCode].acceptedItems11.length > 0  ?  '#004aad' : 'gray.300';
    // let serialNo = 0;


      const loadAcceptedItemData12 = async () => {

        AsyncStorage.getItem('acceptedItemData11')
        .then(data99 => {
          setAcceptedItemData(JSON.parse(data99));
          console.log('ghghg',data99);
          console.log('ghghg',acceptedItemData);
        })
        .catch(e => {
        console.log(e);
        });

        // try {
        //   const data99 = await AsyncStorage.getItem('acceptedItemData11');
        //   if (data99 !== null) {
        //     setAcceptedItemData(JSON.parse(data99));
        //     console.log("ghghg",data99);
        //     console.log("ghghg",acceptedItemData);
        //   }
        // } catch (error) {
        //   console.log(error);
        // }
      };

    useEffect(() => {
      // const saveAcceptedItemData = async () => {
        // try {
           AsyncStorage.setItem('acceptedItemData11',JSON.stringify(acceptedItemData));
        // } catch (error) {
          console.log('aaaa',acceptedItemData);
        // }
      // };

      // saveAcceptedItemData();
    }, [
      // data && data.length  && data[0].consignorCode && acceptedItemData[data[0].consignorCode] &&
      scanprogressRD]);

    useEffect(() => {
      setBagId();
    }, [bagId]);

    // useEffect(() => {
    //       updateDetails2();
    //       console.log("fdfdd "+barcode);
    // });
    useEffect(() => {
      console.log('fdfdd ',acceptedItemData);
});
useEffect(() => {
  loadAcceptedItemData12();
},[]);


    useEffect(() => {
      createTableBag1();
    }, []);

    const createTableBag1 = () => {

      db.transaction(tx => {
        // tx.executeSql('DROP TABLE IF EXISTS closeHandoverBag1', []);
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS closeHandoverBag1 (bagSeal TEXT , bagId TEXT PRIMARY KEY, bagDate TEXT, AcceptedList TEXT,status TEXT,consignorCode Text,consignorName Text)',
          [],
          (tx, results) => {
            console.log('Table created successfully');
          },
          error => {
            console.log('Error occurred while creating the table:', error);
          },
        );
      });
    };



   function CloseBag (consCode,consName) {
  console.log(bagSeal);
  console.log(acceptedArray);
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM closeHandoverBag1 Where consignorCode=? AND bagDate=? ',
      [consCode, currentDate],
      (tx, results) => {
        console.log(results.rows.length);
        console.log(results);
        tx.executeSql(
          'INSERT INTO closeHandoverBag1 (bagSeal, bagId, bagDate, AcceptedList,status,consignorCode,consignorName) VALUES (?, ?, ?, ?,?,?,?)',
          [
            bagSeal,
            consCode + '-' + currentDate + '-' + (results.rows.length + 1),
            currentDate,
            JSON.stringify(acceptedItemData[data[0].consignorCode].acceptedItems11),
            'pending',
            consCode,
            consName,
          ],
          (tx, results11) => {
            console.log('Row inserted successfully');
            setAcceptedArray([]);
            setBagSeal('');
            // acceptedItemData[consCode] = null;
            setAcceptedItemData(Object.fromEntries(Object.entries(acceptedItemData).filter(([k, v]) => k !== consCode)));
            // setTimeout(()=> AsyncStorage.setItem('acceptedItemData11',JSON.stringify(acceptedItemData)),1000);
            console.log(' Data Added to local db successfully Handover closeBag');
            ToastAndroid.show('Bag closed successfully', ToastAndroid.SHORT);
            console.log(results11);
            viewDetailBag();
          },
          error => {
            console.log('Error occurred while inserting a row:', error);
          },
        );
      },
      error => {
        console.log('Error occurred while generating a unique bag ID:', error);
      },
    );
  });
}

const viewDetailBag = () => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM closeHandoverBag1', [], (tx1, results) => {
      let temp = [];
      console.log(results.rows.length);
      for (let i = 0; i < results.rows.length; ++i) {
        temp.push(results.rows.item(i));
      }
      console.log(
        'Data from Local Database Handover Bag: \n ',
        JSON.stringify(temp, null, 4),
      );
    });
  });
};


      const updateDetails2 = (data) => {
        console.log('scan 4545454');

        db.transaction((tx) => {
            tx.executeSql('UPDATE SellerMainScreenDetails  SET handoverStatus="accepted" WHERE shipmentAction="Seller Delivery" AND (awbNo = ? OR clientShipmentReferenceNumber = ? OR clientRefId = ? )', [ data,data,data], (tx1, results) => {
                let temp = [];
                console.log('Results',results.rowsAffected);
                console.log(results);

                if (results.rowsAffected > 0) {
                  console.log( data + 'accepted');
                  ToastAndroid.show( data + ' Accepted',ToastAndroid.SHORT);
                  db.transaction(tx => {
                    tx.executeSql(
                      'SELECT consignorCode FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND (awbNo = ? OR clientShipmentReferenceNumber = ? OR clientRefId = ? )  AND handoverStatus="accepted"',
                      [ data,data,data],
                      (tx2, results122) => {
                        console.log(results122.rows.item(0));
                        loadDetails(results122.rows.item(0).consignorCode);
                        // setnewAccepted(results122.rows.item[0].consignorName);

                      },
                    );
                  });
                } else {
                  console.log(barcode + 'not accepted');
                }
                console.log(results.rows.length);
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                // }
                // console.log('Data updated: \n ', JSON.stringify(temp, null, 4));
                // viewDetails2();
            });
        });
      };


      const loadDetails = (data333) => {
        acceptedItemData[data333] ?  acceptedItemData[data333] &&
        !acceptedItemData[data333].acceptedItems11.includes(barcode)
          ? setAcceptedItemData(prevState => ({
              ...prevState,
              [data333]: {
                ...prevState[data333],
                acceptedItems11: [
                  ...prevState[data333].acceptedItems11,
                  barcode,
                ],
              },
            }))
          : null : setModalVisible(true);

          // setTimeout(()=> AsyncStorage.setItem('acceptedItemData11',JSON.stringify(acceptedItemData)),1000);

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SyncSellerPickUp WHERE consignorCode=?', [data333], (tx1, results) => {
                let temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
                setData(temp);


            });

            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=?  AND handoverStatus="accepted"',
                [data333],
                (tx1, results) => {
                  setScanProgressRD(results.rows.length);
                },
              );
            });

            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=?  ',
                [data333],
                (tx1, results) => {
                  setSellerNoOfShipment(results.rows.length);
                },
              );
            });
        });
    };

    const getCategories = (data) => {
      db.transaction(txn => {
        txn.executeSql(
          'SELECT * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Delivery" AND (awbNo = ? OR clientShipmentReferenceNumber = ? OR clientRefId = ? )AND handoverStatus IS NULL ',
          [data, data, data],
          (sqlTxn, res) => {
            console.log('categories retrieved successfully', res.rows.length);

            if (!res.rows.length){
              db.transaction((tx) => {
                console.log('ok3333',data);

                tx.executeSql('Select * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Delivery" AND handoverStatus IS NOT NULL  AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?)', [data,data,data], (tx1, results) => {
                  console.log('Results121', results.rows.length);
                  console.log('ok4444',data);

                  console.log(data);
                  if (results.rows.length === 0) {
                    ToastAndroid.show('Scanning wrong product',ToastAndroid.SHORT);
                  } else {
                    ToastAndroid.show(data + ' already scanned',ToastAndroid.SHORT);
                    setBarcode(() => data);
                    db.transaction(tx => {
                      tx.executeSql(
                        'SELECT consignorCode FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND (awbNo = ? OR clientShipmentReferenceNumber = ? OR clientRefId = ? )  AND handoverStatus="accepted"',
                        [ data,data,data],
                        (tx2, results122) => {
                          console.log(results122.rows.item(0));
                      //  if (acceptedItemData[results122.rows.item(0).consignorCode] !== null)
                      //  {

                        // if (acceptedItemData[results122.rows.item(0).consignorCode] && acceptedItemData[results122.rows.item(0).consignorCode].acceptedItems11.length > 0)
                        //  {
                        //     acceptedItemData[results122.rows.item(0).consignorCode].acceptedItems11.push(data);
                        //   }
                          // else {
//
                          // }

                      //   } else {
                        // setModalVisible(true);
                        // }



                          loadDetails(results122.rows.item(0).consignorCode);

                          // setnewAccepted(results122.rows.item[0].consignorName);

                        },
                      );
                    });
                  }
                });
              });
              // alert('You are scanning wrong product, please check.');
            } else {
                setBarcode(() => data);
                Vibration.vibrate(100);
                RNBeep.beep();
                updateDetails2(data);
                // loadDetails(data);
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
      setBarcode(e.data);
      // Vibration.vibrate(100);
      // RNBeep.beep();
      // if (
        (barcode === e.data) ? getCategories(e.data) : setBarcode(e.data); getCategories(e.data);

        // getCategories(e.data);

      // }
      // displayConsignorDetails11();
    };


    const onSuccess11 = e => {
      Vibration.vibrate(100);
      RNBeep.beep();
      console.log(e.data, 'sealID');
      // getCategories(e.data);
      setBagSeal(e.data);
    };

    const UpdateShipmentList = () => {
      db.transaction(txn => {
        txn.executeSql('UPDATE SyncSellerPickUp SET ShipmentListArray=? WHERE consignorCode=?', [
            acceptedArray.toString(),
            barcode,
        ], (sqlTxn, _res) => {
            setModalVisible(false);

        }, error => {
            console.log('error on adding data ' + error.message);
        },);
    });
    };

    const bagopenCloseHandler = (consCode11,consName11) => {

      const newData = {};
      newData[consCode11] = {
        acceptedItems11: [barcode],
        consignorName: consName11,
      };
      setAcceptedItemData(prevData => ({...prevData, ...newData}));
      // setTimeout(()=> AsyncStorage.setItem('acceptedItemData11',JSON.stringify(acceptedItemData)),1000);

      // db.transaction((tx) => {
      //   tx.executeSql('UPDATE SyncSellerPickUp SET BagOpenClose="open" WHERE consignorCode=?', [barcode], (tx1, results) => {
      //     setAcceptedArray(prevarr => [...prevarr, barcode.toString()]);
      //     UpdateShipmentList();
      //   },
      //   error => {
      //     console.log('error on adding data ' + error.message);
      // },);

    // });
    };


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
            <Button flex="1" mt={2} bg="#004aad" onPress={() => { CloseBag(data[0].consignorCode,data[0].consignorName); setShowCloseBagModal(false); }}>Submit</Button>
            <View style={{alignItems: 'center', marginTop: 15}}>
              <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '500', color: 'black'}}>Seller Code</Text>
                {
                    data && data.length ? (
                        <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{data[0].consignorCode}</Text>
                    ) : null
                }
                {/* <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{sellerCode11}</Text> */}

              </View>
              <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>Seller Name</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{data[0].consignorName}</Text>
                  ) : null
                }
              </View>
              <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 1, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>Number of Shipments</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{data && data.length  && data[0].consignorCode && acceptedItemData[data[0].consignorCode] && acceptedItemData[data[0].consignorCode].acceptedItems11.length > 0 ? acceptedItemData[data[0].consignorCode].acceptedItems11.length : null}</Text>
                  ) : null
                }
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          {/* <Modal.Header />
           */}
           <Modal.Header>Open Bag</Modal.Header>
          <Modal.Body>
          <Text  style={{fontWeight:'500', paddingLeft: 15,paddingRight:15,  justifyContent: 'space-between',fontSize: 16.5, color:'black',marginTop: 10 }}>The seller has {
                  data && data.length ? (
                    <Text style={{fontSize: 16, fontWeight: '500', color: 'black'}}>{scanprogressRD}</Text>
                  ) : null
                } shipments. Would you like to open a bag?</Text>
          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 20 }}>
            <Button onPress={() => {bagopenCloseHandler(data[0].consignorCode,data[0].consignorName); setModalVisible(false);}} w="48%" size="lg" bg="#004aad" >Yes</Button>
            <Button onPress={() => setModalVisible(false)} w="48%" size="lg" bg="#004aad">No</Button>
          </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <ScrollView style={{paddingTop: 20, paddingBottom: 50,backgroundColor: 'white'}} showsVerticalScrollIndicator={false}>
      {!showCloseBagModal && <QRCodeScanner
          onRead={onSuccess}
          reactivate={true}
          reactivateTimeout={3000}
          flashMode={RNCamera.Constants.FlashMode.off}
          containerStyle={{width: '100%', alignSelf: 'center', backgroundColor: 'white'}}
          cameraStyle={{width: '90%', alignSelf: 'center'}}
          topContent={
            <View><Text>Scan Shipment ID</Text></View>
          }
        />
}
        <View>
          <View style={{backgroundColor: 'white'}}>
            <View style={{alignItems: 'center', marginTop: 15}}>

              <View style={{backgroundColor: 'lightgray', padding: 10, flexDirection: 'row', justifyContent: 'space-between', width: '90%', borderRadius: 5,borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
                <Text style={{fontSize: 18, fontWeight: '500' }}>Shipment ID </Text>
                <Text style={{fontSize: 18, fontWeight: '500' }}>{barcode}</Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500' }}>Seller Code</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 18, fontWeight: '500' }}>{data[0].consignorCode}</Text>
                  ) : null
                }
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500' }}>Seller Name</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 18, fontWeight: '500' }}>{data[0].consignorName}</Text>
                  ) : null
                }
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 10}}>
                {/* <Text style={{fontSize: 18, fontWeight: '500' }}>Shipment scan Progress{'\n'}for {data[0].consignorCode} </Text> */}
                {
                  data && data.length ? (
                    <>
                    <Text style={{fontSize: 18, fontWeight: '500' }}>Shipment scan Progress{'\n'}for {data[0].consignorCode} </Text>
                    <Text style={{fontSize: 18, fontWeight: '500' }}>{scanprogressRD}/{sellerNoOfShipment}</Text>
                    </>
                  ) :
                  <Text style={{fontSize: 18, fontWeight: '500' }}>Shipment scan Progress{'\n'}for  </Text>
                  // null
                }
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 1, marginBottom:0,borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500' }}>Bags Open</Text>
                {data && data.length && data[0].BagOpenClose === 'close' ? (

                    // <TouchableOpacity style={{backgroundColor: 'lightgray', padding: 5, borderRadius: 3}}
                    // //  onPress={() => setModalVisible(true)}
                    //   >
                    <Text style={{fontSize: 18, fontWeight: '500' }}>{data && data.length  && data[0].consignorCode && acceptedItemData[data[0].consignorCode] && acceptedItemData[data[0].consignorCode].acceptedItems11.length > 0 ? 'Yes' : 'No'}</Text>
                    // </TouchableOpacity>

                ) : (
                  <Text style={{fontSize: 18, fontWeight: '500'}} />
                )}
              </View>
            </View>

          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
      <Button w="48%"size="lg" bg={buttonColor} onPress={() => {
    buttonColor === '#004aad'
      ? setShowCloseBagModal(true)
      : data && data.length > 0 && data[0].consignorCode && acceptedItemData[data[0].consignorCode] && acceptedItemData[data[0].consignorCode].acceptedItems11.length === 0 ? ToastAndroid.show('Bag is empty', ToastAndroid.SHORT) : ToastAndroid.show('Open bag to close', ToastAndroid.SHORT);
  }}>
  Close Bag
</Button>

            <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('OpenBags'
            ,{allCloseBAgData :acceptedItemData}
            )}>Close Handover</Button>
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
