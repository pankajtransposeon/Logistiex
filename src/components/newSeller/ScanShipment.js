/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { NativeBaseProvider, Image, Box, Fab, Icon, Button ,Alert, Modal, Input} from 'native-base';
import React, { useEffect, useState , useRef } from 'react';
import axios from 'axios';
import {Text,View, ScrollView, Vibration, ToastAndroid,TouchableOpacity,StyleSheet} from 'react-native';
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
import { panGestureHandlerCustomNativeProps } from 'react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler';
const db = openDatabase({
  name: 'rn_sqlite',
});

const ScanShipment = ({route}) => {
    // const [barcodeValue,setBarcodeValue] = useState('');
    // const [packageValue,setpackageValue] = useState('');
    // const [otp,setOtp] = useState('');
    // const [flag, setflag] = useState(false);
    // const [showModal, setShowModal] = useState(false);
    // const [refresh, setRefresh] = useState(false);
    // const [pending, setPending] = useState(0);
    const [expected, setExpected] = useState(0);
    const [newaccepted, setnewAccepted] = useState(0);
    const [newrejected, setnewRejected] = useState(0);
    const [newtagged, setnewTagged] = useState(0);
    const [barcode, setBarcode] = useState('');
    const [len, setLen] = useState(0);
    const [DropDownValue, setDropDownValue] = useState(null);
    const [rejectedData, setRejectedData] = useState([]);
    const [acceptedArray,setAcceptedArray]=useState([]);
        // const RejectReason = 'https://bked.logistiex.com/ADupdatePrams/getUSER';
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

const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setImages([...images, data.uri]);
    }
  };
  const handleUpload = async () => {
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const data = {
          useCase: "DSQC",
          type: "front",
          contextId: "SI002",
          contextType: "shipment",
          hubCode: "HC001"
        };
    
        const formData = new FormData();
        formData.append("picture", {
          uri: images[i],
          name: `image-${i}.jpg`,
          type: "image/jpeg"
        });
        formData.append("data", JSON.stringify(data));
    
        const response = await fetch(
          "https://bkedtest.logistiex.com/DSQCPicture/uploadPicture",
          {
            method: "POST",
            body: formData
          }
        );
        const result = await response.json();
        console.log(result);
      }
    }
  };
  

  const recordVideo = () => {
    console.log('Recording a video is not implemented yet');
  };
    // const PartialClose = 'https://bked.logistiex.com/ADupdatePrams/getPartialClosureReasons';
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
  
    // useEffect(() => {
    //   partialClose112();
    // }, []);
  
    const partialClose112 = () => {
      if (newaccepted + newrejected === 5){
        sendSmsOtp();
      } else {
        setModalVisible11(true);
      }
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
    axios.post('https://bked.logistiex.com/SellerMainScreen/postRD', {
      excepted:route.params.Forward,
      accepted: route.params.accepted,
      rejected:route.params.rejected,
      nothandedOver:0,
      feUserID: route.params.userId,
      receivingDate : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
      receivingTime: new Date().toLocaleString(),
      latitude11 : latitude11,
      longitude11 : longitude11,
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
        setShowModal11(true);
      } 
      else {
        console.log("Otp not send", response);
      }
    }
  
    function handleButtonPress11(item) {
      // if(item=='Partial Dispatch'){
      //   navigation.navigate('Dispatch');
      // }
        setDropDownValue11(item);
      // setModalVisible11(false);
    }
  
    function validateOTP(){
      axios.post("https://bked.logistiex.com/SMS/OTPValidate", {
        mobileNumber: mobileNumber,
        otp: inputOtp
      })
      .then(response => {
        if(response.data.return){
          submitForm11();
          setInputOtp("");
          setShowModal11(false);
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

    
    // useEffect(() => {
    //   setBagId();
    // }, [bagId]);

    // useEffect(() => {
    //       updateDetails2();
    //       console.log("fdfdd "+barcode);
    // });
    
    function CloseBag(){
      console.log(bagSeal);
      console.log(acceptedArray);
      let date = new Date().getDate();
      let month = new Date().getMonth() + 1;
      let year = new Date().getFullYear();
      let date11 = date + '' + month + '' + year;
      // console.log(route.params.userId + date11 + bagIdNo);
      let bagId11 = route.params.userId + date11 + bagIdNo;
      setBagId(route.params.userId + date11 + bagIdNo);
      console.log(bagId);
      db.transaction(txn => {
        txn.executeSql('INSERT OR REPLACE INTO closeBag1( bagId,bagSeal,AcceptedList) VALUES (?,?,?)', [
            bagId11,
            bagSeal,
            acceptedArray.toString(),
        ], (sqlTxn, _res) => {
       setBagIdNo(bagIdNo + 1);
       setAcceptedArray([]);
       setBagSeal('');
            console.log(`\n Data Added to local db successfully closebag`);

            console.log(_res);
            viewDetailBag();
        }, error => {
            console.log('error on adding data ' + error.message);
        },);
    });
    }
    const viewDetailBag = () => {
      db.transaction(tx => {
          tx.executeSql('SELECT * FROM closeBag1', [], (tx1, results) => {
              let temp = [];
              console.log(results.rows.length);
              for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
                  // console.log(results.rows.item(i).consignorName);
                  // var address121 = results.rows.item(i).AcceptedList;
                  // var address_json = JSON.parse(address121);
                  // console.log(typeof (address_json));
                  // console.log("Address from local db : " , address_json);
                  // ToastAndroid.show('consignorName:' + results.rows.item(i).consignorName + "\n" + 'PRSNumber : ' + results.rows.item(i).PRSNumber, ToastAndroid.SHORT);
              }
              // ToastAndroid.show("Sync Successful",ToastAndroid.SHORT);
              console.log("Data from Local Database : \n ", JSON.stringify(temp, null, 4));
              // console.log('Table1 DB OK:', temp.length);
          });
      });
  };

     useEffect(() => {
            createTableBag1();
    },[]);

    const createTableBag1 = () => {
      db.transaction(txn => {
          txn.executeSql('DROP TABLE IF EXISTS closeBag1', []);
          txn.executeSql(`CREATE TABLE IF NOT EXISTS closeBag1( 
            bagId VARCHAR(100) PRIMARY KEY ,
        bagSeal VARCHAR(100),
        AcceptedList VARCHAR(600)
      )`, [], (sqlTxn, res) => {
              console.log("table created successfully details213 ");
              // loadAPI_Data();
          }, error => {
              console.log('error on creating table ' + error.message);
          },);
      });
  };
      const updateDetails2 = () => {
        console.log('scan '+barcode.toString());
        setAcceptedArray([...acceptedArray, barcode.toString()]);
        console.log(acceptedArray);
        db.transaction((tx) => {
            tx.executeSql('UPDATE SellerMainScreenDetails SET status="accepted" WHERE clientShipmentReferenceNumber=?', [barcode], (tx1, results) => {
                let temp = [];
                console.log('Results',results.rowsAffected);
                console.log(results);

                if (results.rowsAffected > 0) {
                  console.log(barcode + 'accepted');
                  ToastAndroid.show(barcode +" Accepted",ToastAndroid.SHORT);

                } else {
                  console.log(barcode + 'not accepted');
                }
                console.log(results.rows.length);
                for (let i = 0; i < results.rows.length; ++ i) {
                    temp.push(results.rows.item(i));
                }
                // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
                // viewDetails2();
            });
        });
      };

      const rejectDetails2 = () => {
        console.log('scan 45456');
        setnewRejected(newrejected+1);
        db.transaction((tx) => {
            tx.executeSql('UPDATE SellerMainScreenDetails SET status="rejected" ,rejectedReason=? WHERE clientShipmentReferenceNumber=?', [DropDownValue,barcode], (tx1, results) => {
                let temp = [];
                // console.log("ddsds4545",tx1);
                console.log("Rejected Reason : ",DropDownValue);
                console.log('Results',results.rowsAffected);
                console.log(results);
                if (results.rowsAffected > 0) {
                  console.log(barcode + 'rejected');
                  ToastAndroid.show(barcode +" Rejected",ToastAndroid.SHORT);
                } else {
                  console.log(barcode + 'failed to reject item locally');
                }
                console.log(results.rows.length);
                for (let i = 0; i < results.rows.length; ++ i) {
                    temp.push(results.rows.item(i));
                }
                // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
                // viewDetailsR2();
            });
        });
      };
      const taggedDetails = () => {
        console.log('scan 45456');
        setnewTagged(newtagged+1);
        db.transaction((tx) => {
            tx.executeSql('UPDATE SellerMainScreenDetails SET status="accepted" ,rejectedReason=? WHERE clientShipmentReferenceNumber=?', [DropDownValue,barcode], (tx1, results) => {
                let temp = [];
                // console.log("ddsds4545",tx1);
                console.log("Rejected Reason : ",DropDownValue);
                console.log('Results',results.rowsAffected);
                console.log(results);
                if (results.rowsAffected > 0) {
                  console.log(barcode + 'rejected');
                  ToastAndroid.show(barcode +" Rejected",ToastAndroid.SHORT);
                } else {
                  console.log(barcode + 'failed to reject item locally');
                }
                console.log(results.rows.length);
                for (let i = 0; i < results.rows.length; ++ i) {
                    temp.push(results.rows.item(i));
                }
            });
        });
      };

      const viewDetails2 = () => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where status = "accepted"', [], (tx1, results) => {
                let temp = [];
                console.log(results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    console.log('barcode ' + results.rows.item(i).awbNo);
                }
                // ToastAndroid.show('Sync Successful',ToastAndroid.SHORT);
                console.log('Data from Local Database : \n ', JSON.stringify(temp, null, 4));
            });
        });
      };
      const viewDetailsR2 = () => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where status = "rejected"', [], (tx1, results) => {
                let temp = [];
                console.log(results.rows.length);
                // setnewRejected(results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    console.log('barcode ' + results.rows.item(i).awbNo);
                }
                // ToastAndroid.show('Sync Successful',ToastAndroid.SHORT);
                console.log('Data from Local Database : \n ', JSON.stringify(temp, null, 4));
            });
        });
      };
      const partialClose = () => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE SellerMainScreenDetails SET status="notPicked" , rejectedReason=? WHERE status IS Null', [DropDownValue11], (tx1, results) => {
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
              for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
              }
              // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
          });
      });
  }

    const getCategories = (data) => {
      db.transaction(txn => {
        txn.executeSql(
          'SELECT * FROM categories WHERE clientShipmentReferenceNumber = ? AND ScanStatus = ? ',
          [data, 0],
          (sqlTxn, res) => {
            console.log('categories retrieved successfully', res.rows.length);
            setLen(res.rows.length);
            if (!res.rows.length){
              alert('You are scanning wrong product, please check.');
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
          'UPDATE categories set ScanStatus=? where clientShipmentReferenceNumber=?',
          [1, data],
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
      getCategories(e.data);
      setBarcode(e.data);
    };

    useEffect(() => {
      if (len) {
        ContinueHandle();
        Vibration.vibrate(100);
        RNBeep.beep();
        // ToastAndroid.show(barcode + ' accepted',ToastAndroid.SHORT);
        updateDetails2();


        setLen(false);
        updateCategories(barcode);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [len]);

    const displaydata = async() => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM ShipmentRejectReasons', [], (tx1, results) => {
            let temp = [];
            // console.log(results.rows.length);
            for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
            }
            // ToastAndroid.show('Sync Successful3', ToastAndroid.SHORT);
            setRejectedData(temp);

            // console.log('Data from Local Database reject reasons: \n ', JSON.stringify(temp, null, 4),);
            // console.log('Table3 DB OK:', temp.length);
        },);
    });
      // await fetch(RejectReason)
      // .then((response) => response.json())
      // .then((json) => {
      //   setRejectedData(json);
      // })
      // .catch((error) => alert(error));
    };
    const navigation = useNavigation();
    const [count, setcount] = useState(0);

    const ContinueHandle = () => {
      const getUser = async () => {
        try {
          const savedUser = await AsyncStorage.getItem('user');
          const currentUser = JSON.parse(savedUser);
          await AsyncStorage.setItem('user', JSON.stringify({
            Accepted: currentUser.Accepted + 1,
            Rejected: currentUser.Rejected,
          }));
          setnewAccepted(1 + currentUser.Accepted);
          setnewRejected(currentUser.Rejected);
        } catch (error) {
          console.log(error);
        }
      };
      getUser();
    };

    useEffect(() => {
      async function userdata() {
        const savedUser = await AsyncStorage.getItem('user');
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
                if (status)
                    {console.log('Location enabled');}
            }).catch(err=>{
            });
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
          ContinueHandle();
          // navigation.navigate('ScanShipment');
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

      <Modal isOpen={modalVisible} onClose={() => {setModalVisible(false); setImages([])}} size="lg">
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
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} onPress={()=>{setModalVisible(false); taggedDetails(); setImages([])}} >Tag Shipment</Button>
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
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} >Save</Button>
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
                <Text style={{fontSize: 18, fontWeight: '500'}}>{route.params.Forward}</Text>
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
