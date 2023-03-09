/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { NativeBaseProvider, Image, Box, Fab, Icon, Button ,Alert, Modal, Input} from 'native-base';
import React, { useEffect, useState , useRef } from 'react';
import axios from 'axios';
import {PermissionsAndroid, Text,View, ScrollView, Vibration, ToastAndroid,TouchableOpacity,StyleSheet} from 'react-native';
import { Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { openDatabase } from 'react-native-sqlite-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import RNBeep from 'react-native-a-beep';
import { Picker } from '@react-native-picker/picker';
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { backgroundColor, borderColor, height, marginTop, style } from 'styled-system';
import { Console } from 'console';
// import GetLocation from 'react-native-get-location';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import OTPTextInput from 'react-native-otp-textinput';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { panGestureHandlerCustomNativeProps } from 'react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler';
const db = openDatabase({
  name: 'rn_sqlite',
});

const ScanShipment = ({route}) => {
    const [expected, setExpected] = useState(0);
    const [newaccepted, setnewAccepted] = useState(0);
    const [newrejected, setnewRejected] = useState(0);
    const [newtagged, setnewTagged] = useState(0);
    const [barcode, setBarcode] = useState('');
    const [len, setLen] = useState(0);
    const [DropDownValue, setDropDownValue] = useState(null);
    const [rejectedData, setRejectedData] = useState([]);
    const [acceptedArray,setAcceptedArray]=useState([]);
        // const RejectReason = 'https://bkedtest.logistiex.com/ADupdatePrams/getUSER';
    const [latitude, setLatitude] = useState(0);
    const [longitude , setLongitude] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [bagId, setBagId] = useState('');
    const [bagIdNo, setBagIdNo] = useState(1);
    const [showCloseBagModal, setShowCloseBagModal] = useState(false);
    const [bagSeal, setBagSeal] = useState('');


    var otpInput = useRef(null)
    // const navigation = useNavigation();
    const [name, setName] = useState('');
    const [inputOtp, setInputOtp] = useState('');
    const [mobileNumber, setMobileNumber] = useState(route.params.phone);
    const [latitude11, setLatitude11] = useState(0);
    const [longitude11 , setLongitude11] = useState(0);
    const [showModal11, setShowModal11] = useState(false);
    const [modalVisible11, setModalVisible11] = useState(false);
    const [DropDownValue11, setDropDownValue11] = useState(null);
    const [PartialCloseData, setPartialCloseData] = useState([]);
    // const camera = useRef(null);
    const [images, setImages] = useState([]);
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    };
  
    const createFormData = (photo, body) => {
      const data = new FormData();
  
      data.append("file", {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
      });
  
      Object.keys(body).forEach(key => {
        data.append(key, body[key]);
      });
      return data;
    };
  
    const takePicture = async () => {
  let options = {
    mediaType: 'photo',
    quality: 1,
    cameraType: 'back',
    maxWidth: 480,
    maxHeight: 480,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  }
  let isGranted = await requestCameraPermission();
  let results = [];
  if (isGranted) {
    results = await launchCamera({ ...options, multiple: true });
    console.log(results)
  }
  if (results.assets !== undefined) {
    const urls = [];
    for (let i = 0; i < results.assets.length; i++) {
      const result = results.assets[i];
      try {
        const formData = createFormData(result, {
          useCase: "DSQC",
          type: "front",
          contextId: "SI002",
          contextType: "shipment",
          hubCode: "HC001"
        });
        const response = await fetch('https://bkedtest.logistiex.com/DSQCPicture/uploadPicture', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log('upload success', data);
        urls.push(data.publicURL);
      } catch (error) {
        console.log('upload error', error);
        return;
      }
    }
    setImages(urls);
  }
    }
    console.log('image1',images[0]);
    console.log('image12',images[1]);
// const takePicture = async () => {
//     if (camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await camera.takePictureAsync(options);
//       console.log(data);
//       setImages([...images, data.uri]);
//     }
//   };
//   const handleUpload = async () => {
//     if (images.length > 0) {
//       for (let i = 0; i < images.length; i++) {
//         const data = {
//           useCase: "DSQC",
//           type: "front",
//           contextId: "SI002",
//           contextType: "shipment",
//           hubCode: "HC001"
//         };
  
//         const formData = new FormData();
//         const picture = {
//           uri: images[i],
//           name: `image-${i}.jpg`,
//           type: "image/jpeg"
//         };
//         if (picture.uri) {
//           formData.append("picture", picture, picture.name);
//           console.log(picture.name)
//         }
//         formData.append("data", JSON.stringify(data));

//         try {
//           const response = await fetch(
//             "https://bkedtest.logistiex.com/DSQCPicture/uploadPicture",
//             {
//               method: "POST",
//               body: formData
//             }
//           );
//           const result = await response.json();
//           console.log("Result:",result);
//         } catch (error) {
//           console.error("Error uploading image:", error);
//         }
//       }
//     }
//   };
  

  const recordVideo = () => {
    console.log('Recording a video is not implemented yet');
  };
  
  const scannerRef = useRef(null);

  const reloadScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.reactivate();
    }
  };
  useEffect(() => {
  reloadScanner();
  }, []);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      displayDataSPScan();
    });
    return unsubscribe;
  }, [navigation]);
  

  const displayDataSPScan = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=?  AND status="accepted"',
        [route.params.consignorCode],
        (tx1, results) => {
          setnewAccepted(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? AND status="notPicked"',
        [route.params.consignorCode],
        (tx1, results) => {
          setNewNotPicked(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? AND status="rejected"',
        [route.params.consignorCode],
        (tx1, results) => {
          setnewRejected(results.rows.length);
        },
      );
    });
  };

  useEffect(() => {
    const current_location = () => {

      return GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        })
        .then(latestLocation => {
          console.log('latest location ' + JSON.stringify(latestLocation));
          return latestLocation;
        }).then(location => {
          const currentLoc = {
            latitude11: location.latitude11,
            longitude11: location.longitude11,
          };
          setLatitude11(location.latitude11);
          setLongitude11(location.longitude11);
          return currentLoc;
        }).catch(error => {
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
              interval: 10000,
              fastInterval: 5000,
            })
            .then(status => {
              if (status) {
                console.log('Location enabled');
              }
            }).catch(err => {});
          return false;
        });
    };

    current_location();
  }, []);


  const updateDetails2 = () => {
    console.log('scan ' + barcode.toString());
    setAcceptedArray([...acceptedArray, barcode.toString()]);
    console.log(acceptedArray);
    db.transaction((tx) => {
      tx.executeSql('UPDATE SellerMainScreenDetails SET status="accepted" WHERE  consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?) ', [route.params.consignorCode,barcode,barcode,barcode], (tx1, results) => {
        let temp = [];
        console.log('Results', results.rowsAffected);
        console.log(results);

        if (results.rowsAffected > 0) {
          console.log(barcode + 'accepted');
          displayDataSPScan();

        } else {
          console.log(barcode + 'not accepted');
        }
        console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        
      });
    });
  };

  const rejectDetails2 = () => {

    db.transaction((tx) => {
      tx.executeSql('UPDATE SellerMainScreenDetails SET status="rejected" ,rejectedReason=?  WHERE status="accepted" AND consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?) ', [DropDownValue,route.params.consignorCode, barcode,barcode,barcode], (tx1, results) => {
        let temp = [];
        console.log('Rejected Reason : ', DropDownValue);
        console.log('Results', results.rowsAffected);
        console.log(results);
        if (results.rowsAffected > 0) {
          // ContinueHandle11();
          console.log(barcode + 'rejected');
          ToastAndroid.show(barcode + ' Rejected', ToastAndroid.SHORT);
          setDropDownValue('');
          console.log(acceptedArray);
          const newArray = acceptedArray.filter(item => item !== barcode);
          console.log(newArray);
          setAcceptedArray(newArray);
          displayDataSPScan();
        } else {
          console.log(barcode + 'failed to reject item locally');
        }
        console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
        // viewDetailsR2();
      });
    });
  };

  
  const getCategories = (data) => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE status IS NULL AND  consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber = ?) ',
        [route.params.consignorCode,data,data,data],
        (sqlTxn, res) => {
          console.log('ok1111',data);
          setLen(res.rows.length);
          setBarcode(data);
          if (!res.rows.length) {
            console.log(data);
            console.log('ok2222',data);

            db.transaction((tx) => {
              console.log('ok3333',data);

              tx.executeSql('Select * FROM SellerMainScreenDetails WHERE status IS NOT NULL And consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?)', [route.params.consignorCode,data,data,data], (tx1, results) => {
                console.log('Results121', results.rows.length);
                console.log('ok4444',data);

                console.log(data);
                if (results.rows.length === 0) {
                  ToastAndroid.show('Scanning wrong product',ToastAndroid.SHORT);
                } else {
                  ToastAndroid.show(data + ' already scanned',ToastAndroid.SHORT);
                }
              });
            });
          }
        },
        error => {
          console.log('error on getting categories ' + error.message);
        },
      );
    });
  };

  const updateCategories = (data) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE SellerMainScreenDetails set status=? where clientShipmentReferenceNumber=?',
        ['accepted', data],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
        }
      );
    });
  };

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
  };
  const onSuccess = e => {
    console.log(e.data, 'barcode');
    setBarcode(e.data);
    getCategories(e.data);
  };
  const onSuccess11 = e => {
    Vibration.vibrate(100);
    RNBeep.beep();
    console.log(e.data, 'sealID');
    setBagSeal(e.data);
  };

  useEffect(() => {
    if (len) {
      Vibration.vibrate(100);
      RNBeep.beep();
      ToastAndroid.show(barcode + ' Accepted', ToastAndroid.SHORT);
      updateDetails2();
      displayDataSPScan();

      setLen(false);
    }
  }, [len]);

  const displaydata = async () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM ShipmentRejectReasons', [], (tx1, results) => {
        let temp = [];
        // console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setRejectedData(temp);
      }, );
    });
  };
  const navigation = useNavigation();
  const [count, setcount] = useState(0);

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
              console.log(res, 'tanmay');
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
                PRSNumber: res.PRSNumber,
              })
                .then(function (response) {
                  console.log(response.data, 'hello');
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
  };
  useEffect(() => {
    displaydata();
  }, []);
  useEffect(() => {
    const current_location = () => {
      return GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        })
        .then(latestLocation => {
          // console.log('latest location ' + JSON.stringify(latestLocation));
          return latestLocation;
        }).then(location => {
          const currentLoc = {
            latitude: location.latitude,
            longitude: location.longitude,
          };
          setLatitude(location.latitude);
          setLongitude(location.longitude);
          return currentLoc;
        }).catch(error => {
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
              interval: 10000,
              fastInterval: 5000,
            })
            .then(status => {
              if (status) {
                console.log('Location enabled');
              }
            }).catch(err => {});
          return false;
        });
    };
    current_location();
  }, []);

  const submitForm = () => {
    axios.post('https://bked.logistiex.com/SellerMainScreen/postSPS', {
      clientShipmentReferenceNumber : route.params.barcode,
      feUserID: route.params.userId,
      isAccepted : 'false',
      rejectionReason : DropDownValue,
      consignorCode : route.params.consignorCode,
      pickupTime : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
      latitude : latitude,
      longitude : longitude,
      packagingId : 'PL00000026',
      packageingStatus : 1,
      PRSNumber : route.params.PRSNumber,
    })
      .then(function (response) {
        console.log(response.data, 'Data has been pushed');
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function handleButtonPress(item) {
    setDropDownValue(item);
    submitForm();
  }
  return (
    <NativeBaseProvider>

      <Modal isOpen={modalVisible} onClose={() => {setModalVisible(false)}} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Return Handover Rejection Tag</Modal.Header>
          <Modal.Body>
          {rejectedData.map((d) => (
            <Button key={d.shipmentExceptionReasonID} flex="1" mt={2}  marginBottom={1.5} marginTop={1.5} title={d.shipmentExceptionReasonName} style={{backgroundColor: d.shipmentExceptionReasonName === DropDownValue ? '#6666FF' : '#C8C8C8'}} onPress={() => handleButtonPress(d.shipmentExceptionReasonName)} >
            <Text style={{color:DropDownValue == d.shipmentExceptionReasonName ? 'white' : 'black'}}>{d.shipmentExceptionReasonName}</Text></Button>
            ))}
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} marginRight={1} onPress={()=>{setModalVisible(false);rejectDetails2();setImages([])}}>Reject Shipment</Button>
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} onPress={()=>{setModalVisible(false);setImages([])}} >Tag Shipment</Button>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={modalVisible1} onClose={() => {setModalVisible1(false); setImages([])}} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Return Handover Rejection Tag</Modal.Header>
          <Modal.Body>
          <View style={{ flex: 1}}>
          <RNCamera
        ref={(ref) => {
          camera = ref;
        }}
        style={{ flex: 1 ,width:300,height:300}}
        type={RNCamera.Constants.Type.back}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: 20
          }}
        >
          <TouchableOpacity onPress={takePicture} style={{ marginRight: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Take photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={recordVideo}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Record video</Text>
          </TouchableOpacity>
        </View>
      </RNCamera>
      {images.length > 0 && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,marginTop:50}}>
          {images.map((image, index) => (
            <Image key={index} style={{ width: 200, height: 200 }} source={{ uri: image }} />
          ))}
        </View>
        )}
        </View>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} marginRight={1} onPress={()=>setImages([])}>ReScan/Record</Button>
            {images.length<5 ?
            <Button opacity={0.5}  disabled={true} flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} >Save</Button>
            :
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} onPress={()=>{ handleUpload(); setModalVisible(true); setModalVisible1(false)}} >Save</Button>
            }
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
            <View><Text>Scanner</Text></View>
          }
        />
        <View>
        <Center>
      </Center>
    </View>
        <View>
          <View style={{backgroundColor: 'white'}}>
            <View style={{alignItems: 'center', marginTop: 15}}>
              <View style={{backgroundColor: 'lightgray', padding: 10, flexDirection: 'row', justifyContent: 'space-between', width: '90%', borderRadius: 5}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>shipment ID: </Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{barcode}</Text>
              </View>
              <Button title="Reject Shipment" onPress={() => setModalVisible1(true)} w="90%" size="lg" bg="#004aad" mb={4} mt={4}>Reject/Tag Shipment</Button>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Expected</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{route.params.Expected}</Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Accepted</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{newaccepted}</Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Tagged</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{newtagged}</Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: 'lightgray', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Not Handed Over</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>{0}</Text>
              </View>
            </View>
          </View>
          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
            <Button onPress={()=>{
            navigation.navigate('CollectPOD',{
              Forward : route.params.Forward,
              accepted : newaccepted,
              rejected : newtagged,
              phone : route.params.phone,
              userId : route.params.userId,
              consignorCode:route.params.consignorCode,
              contactPersonName:route.params.contactPersonName,
            })
            }} w="48%" size="lg" bg="#004aad">End Scan</Button>
            <Button w="48%" size="lg" bg="#004aad" >Resume</Button>
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

export default ScanShipment;

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

// text:{
//   paddingLeft:20,
//   color:'#000',
//   fontWeight:'normal',
//   fontSize:18
// },
// container:{
//     flex:1,
//     fontFamily:'open sans',
//     fontWeight:'normal',
//     color:'#eee',
//     paddingTop:10,
//     paddingBottom:10,
//     flexDirection:'row',
//     justifyContent:'space-between',
//     width: 'auto',
//     borderWidth:1,
//     borderColor:'#eee'

// },

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

  });
