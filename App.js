/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {
    NativeBaseProvider,
    Box,
    Text,
    Image,
    Avatar,
    Heading,
    Button,
    Select,
    Divider,
    Center,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Login from './src/components/Login';
import Main from './src/components/Main';
import NewSellerPickup from './src/components/newSeller/NewSellerPickup';
import SellerHandover from './src/components/newSeller/SellerHandover';
import HandoverShipment from './src/components/newSeller/HandoverShipment';
import OpenBags from './src/components/newSeller/OpenBags';
import PendingHandover from './src/components/newSeller/PendingHandover';
import HandOverSummary from './src/components/newSeller/HandOverSummary';
import NewSellerSelection from './src/components/newSeller/NewSellerSelection';
import ShipmentBarcode from './src/components/newSeller/ShipmentBarcode';
import SellerDeliveries from './src/components/newSeller/SellerDeliveries';
import SellerHandoverSelection from './src/components/newSeller/SellerHandoverSelection';
import ScanShipment from './src/components/newSeller/ScanShipment';
import CollectPOD from './src/components/newSeller/CollectPOD';
import Dispatch from './src/components/newSeller/Dispatch';
import MapScreen from './src/components/MapScreen';
import Reject from './src/components/RejectReason';
import POD from './src/components/newSeller/POD';
import StartTrip from './src/components/StartTrip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    ToastAndroid,
} from 'react-native';
import {Badge} from 'react-native-paper';
// import { Icon } from 'native-base';
// import * as newseller112 from "./src/components/newSeller/NewSellerPickup";
import Lottie from 'lottie-react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {openDatabase} from 'react-native-sqlite-storage';
import NewSellerAdditionNotification from './src/components/NewSellerAdditionNotification';
import StartEndDetails from './src/components/StartEndDetails';
import EndTrip from './src/components/EndTrip';
import SellerSelection from './src/components/newSeller/SellerSelection';
import UpdateSellerCloseReasonCode from './src/components/newSeller/UpdateSellerCloseReasonCode';
import CloseReasonCode from './src/components/newSeller/CloseReasonCode';
import ReturnHandoverRejectionTag from './src/components/newSeller/ReturnHandoverRejectionTag';
import CloseTrip from './src/components/newSeller/CloseTrip';
import HandoverShipmentRTO from './src/components/newSeller/HandoverShipmentRTO';
const db = openDatabase({name: 'rn_sqlite'});
// import ignoreWarnings from 'react-native-ignore-warnings';
// ignoreWarnings(['Warning: Each child in a list should have a unique "key" prop.']);

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
function StackNavigators({navigation}) {
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [data, setData] = useState([]);
    const [isLogin,setIsLogin]=useState(false);
    let m = 0;  
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@storage_Key');
            // console.log(value);
            if (value !== null) {
                const data = JSON.parse(value);
                setUserId(data.userId);
                // Login_Data_load();
                // if(!isLogin){
                //   setIsLogin(true);
                //   Login_Data_load();
                // }
            } else {
                setUserId(' ');
            }
        } catch (e) {
            console.log(e);
        }
    };
  // loadAPI();

    useEffect(() => {
        const StartValue = setInterval(() => {
            getData();
        }, 1000);
        return () => clearInterval(StartValue);
    }, []);

 

    useEffect(() => {
      (async () => {
        if (userId) {
            loadAPI_Data10();
            loadAPI_Data1();
            loadAPI_Data2();
            loadAPI_Data02();
            loadAPI_Data3();
            loadAPI_Data4();
            loadAPI_Data5();
            loadAPI_Data6();
        } else {
          // setTimeout(()=>navigation.navigate('Login'),1000);
          navigation.navigate('Login');
        }
      })();
    }, []);

    // Sync button function
    const pull_API_Data = () => {
      console.log('api pull');
        loadAPI_Data10();
        loadAPI_Data1();
        loadAPI_Data2();
        loadAPI_Data02();
        loadAPI_Data3();
        loadAPI_Data4();
        loadAPI_Data5();
        loadAPI_Data6();
    };
 
    useEffect(() => {
      if (userId !== null) {
        setTimeout(()=>{Login_Data_load();},1000);
      }
    }, [userId]);
    const Login_Data_load = () => {
      // console.log('Login Data Load called');
      AsyncStorage.getItem('apiDataLoaded')
        .then(data11 => {
        // console.log( 'Api Data Loaded value : ',data11);
        setIsLogin(data11);
        if (data11 === 'false') {
          console.log('1st time call');
          pull_API_Data();
        AsyncStorage.setItem('apiDataLoaded', 'true');
          // return;
        }
        })
        .catch(e => {
        console.log(e);
        });
    };
const push_Data = () => {
    console.log('push data function');

    Login_Data_load();
    
    db.transaction(tx => {
        tx.executeSql('SELECT * FROM SellerMainScreenDetails WHERE shipmentStatus="WFP" AND status IS NOT Null', [], (tx1, results) => {
            if (results.rows.length > 0) {
                ToastAndroid.show('Syncing...', ToastAndroid.SHORT);
                // setIsLoading(!isLoading);
                let temp = [];
                let temp11 = 0;
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    let accepted11 = [false];
                    if (results.rows.item(i).status === 'accepted') {
                        accepted11[0] = true;
                    }
                    // console.log(results.rows.item(i));
                    tx.executeSql('SELECT * FROM SyncSellerPickUp where consignorCode=?', [results.rows.item(i).consignorCode], (tx1, results11) => {  
                      console.log('API push');
                      console.log(results.rows.item(i).PRSNumber);
                        setIsLoading(!isLoading);
                        console.log(results11.rows.item(0).consignorLocation);
                        console.log(results.rows.item(i).status);
                        console.log(results.rows.item(i).clientShipmentReferenceNumber, accepted11[0], results.rows.item(i).rejectedReason, results.rows.item(i).consignorCode);
                        // console.log(new Date().toJSON().slice(0,10).replace(/-/g,'/'));
                        console.log('value of temp is :' + temp11 + ' ' + results.rows.length);

                        axios.post('https://bkedtest.logistiex.com/SellerMainScreen/postSPS', {
                            clientShipmentReferenceNumber: results.rows.item(i).clientShipmentReferenceNumber,
                            feUserID: userId,
                            isAccepted: accepted11[0],
                            rejectionReason: results.rows.item(i).rejectedReason,
                            consignorCode: results.rows.item(i).consignorCode,
                            pickupTime: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
                            latitude: results11.rows.item(0).consignorLocation,
                            longitude: results11.rows.item(0).consignorLongitude,
                            // packagingId : results.rows.item(i).packagingId ,
                            packagingId: 'PSN00100',
                            packageingStatus: 1,
                            PRSNumber: 'results.rows.item(i).PRSNumber',
                            pickupBagId: 'ss121',
                        }).then(response => {
                            temp11++;
                            setIsLoading(false);
                            // console.log(response.data, 'Data has been pushed');
                            console.log('Data has been pushed');
                            if (temp11 === results.rows.length) {
                                temp11 = 0;
                                // ToastAndroid.show('Data Pushed Successfully', ToastAndroid.SHORT);
                                console.log('ok now pulling the data');
                                pull_API_Data();
                            }
                        }).catch(error => {
                            setIsLoading(false);
                            console.log(error);
                        });

                    });
                }
            } else {
              console.log('pull11');
                pull_API_Data();
            }
        },);
    });

};

    const sync11 = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected && state.isInternetReachable) {
              push_Data();
            } else {
                ToastAndroid.show('You are Offline!', ToastAndroid.SHORT);
            }
        });
    };


    /*              Press (Ctrl + k + 2) keys together for better API tables view in App.js (VSCode) */


    // Table 1
    const createTables1 = () => {
        db.transaction(txn => {
            txn.executeSql('DROP TABLE IF EXISTS SyncSellerPickUp', []);
            txn.executeSql(`CREATE TABLE IF NOT EXISTS SyncSellerPickUp( consignorCode ID VARCHAR(200) PRIMARY KEY ,userId VARCHAR(100), 
            consignorName VARCHAR(200),consignorAddress1 VARCHAR(200),consignorAddress2 VARCHAR(200),consignorCity VARCHAR(200),consignorPincode,consignorLocation INT(20),consignorLongitude DECIMAL(20,10),consignorContact VARCHAR(200),ReverseDeliveries INT(20),PRSNumber VARCHAR(200),ForwardPickups INT(20), BagOpenClose VARCHAR(200), ShipmentListArray VARCHAR(800),contactPersonName VARCHAR(100))`, [], (sqlTxn, res) => {
                // console.log("table created successfully1212");
                // loadAPI_Data();
            }, error => {
                console.log('error on creating table ' + error.message);
            },);
        });
    };
    const loadAPI_Data1 = () => {

        setIsLoading(!isLoading);
        createTables1();
        (async () => {
            await axios.get(`https://bkedtest.logistiex.com/SellerMainScreen/consignorslist/${userId}`).then(res => {
                console.log('API 1 OK: ' + res.data.data.length);
                // console.log(res);
                for (let i = 0; i < res.data.data.length; i++) {
                    // let m21 = JSON.stringify(res.data[i].consignorAddress, null, 4);
                    db.transaction(txn => {
                        txn.executeSql('INSERT OR REPLACE INTO SyncSellerPickUp( contactPersonName,consignorCode ,userId ,consignorName,consignorAddress1,consignorAddress2,consignorCity,consignorPincode,consignorLocation,consignorLongitude,consignorContact,ReverseDeliveries,PRSNumber,ForwardPickups,BagOpenClose, ShipmentListArray) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                          res.data.data[i].contactPersonName,
                            res.data.data[i].consignorCode,
                            userId,
                            res.data.data[i].consignorName,
                            res.data.data[i].consignorAddress1,
                            res.data.data[i].consignorAddress2,
                            res.data.data[i].consignorCity,
                            res.data.data[i].consignorPincode,
                            res.data.data[i].consignorLatitude,
                            res.data.data[i].consignorLongitude,
                            res.data.data[i].consignorContact,
                            res.data.data[i].ReverseDeliveries,
                            res.data.data[i].PRSNumber,
                            res.data.data[i].ForwardPickups,
                            'close',
                            " "
                        ], (sqlTxn, _res) => {
                            // console.log(`\n Data Added to local db successfully1212`);
                            // console.log(res);
                        }, error => {
                            console.log('error on loading  data from https://bkedtest.logistiex.com/SellerMainScreen/consignorslist/' + error.message);
                        },);
                    });
                }
                viewDetails1();
                m++;
                // console.log('value of m1 '+m);
                AsyncStorage.setItem('load11', 'notload');
                setIsLoading(false);
            }, error => {
                console.log('https://bkedtest.logistiex.com/SellerMainScreen/consignorslist/',error);
            },);
        })();
    };
    const viewDetails1 = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => {
                let temp = [];
                // console.log(results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));

                    console.log(results.rows.item(i).contactPersonName);
                    // var address121 = results.rows.item(i).consignorAddress;
                    // var address_json = JSON.parse(address121);
                    // console.log(typeof (address_json));
                    // console.log("Address from local db : " + address_json.consignorAddress1 + " " + address_json.consignorAddress2);
                    // ToastAndroid.show('consignorName:' + results.rows.item(i).consignorName + "\n" + 'PRSNumber : ' + results.rows.item(i).PRSNumber, ToastAndroid.SHORT);
                }
                if (m === 6){
                  ToastAndroid.show('Sync Successful',ToastAndroid.SHORT);
                  setIsLoading(false);
                  setIsLogin(true);
                  AsyncStorage.setItem('apiDataLoaded', 'true');
                  console.log('All ' + m + ' APIs loaded successfully ');
                  m = 0;

                  AsyncStorage.setItem('refresh11', 'refresh');
                } else {
                console.log('Only ' + m + ' APIs loaded out of 6 ');
              }
                // m++;
                // ToastAndroid.show("Sync Successful",ToastAndroid.SHORT);
                // console.log('Data from Local Database : \n ', JSON.stringify(temp, null, 4));
                // console.log('data loaded API 1',temp);
                // console.log('Table1 DB OK:', temp.length);
            });
        });
    };

    // Table 2
    const createTables2 = () => {
        db.transaction(txn => {
            txn.executeSql('DROP TABLE IF EXISTS SellerMainScreenDetails', []);
            txn.executeSql(`CREATE TABLE IF NOT EXISTS SellerMainScreenDetails( 
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clientShipmentReferenceNumber VARCHAR(200),
          clientRefId VARCHAR(200),
          awbNo VARCHAR(200),
          consignorCode VARCHAR(200),
          packagingStatus VARCHAR(200),
          packagingId VARCHAR(200),
          runSheetNumber VARCHAR(200),
          shipmentStatus VARCHAR(200),
          shipmentAction VARCHAR(200),
          rejectedReason VARCHAR(200),
          actionTime VARCHAR(200),
          status VARCHAR(200)
        )`, [], (sqlTxn, res) => {
                // console.log("table created successfully details213 ");
                // loadAPI_Data();
            }, error => {
                console.log('error on creating table ' + error.message);
            },);
        });
    };
    const loadAPI_Data2 = () => {
        // setIsLoading(!isLoading);
        (async () => {
            await axios.get(`https://bkedtest.logistiex.com/SellerMainScreen/workload/${userId}`).then(res => {
                createTables2();
                console.log('API 2 OK: ' + res.data.data.length);
                for (let i = 0; i < res.data.data.length; i++) {  //console.log(res.data.data[i].shipmentStatus);
                    db.transaction(txn => {
                        txn.executeSql(`INSERT OR REPLACE INTO SellerMainScreenDetails( 
                  clientShipmentReferenceNumber ,
                  clientRefId ,
                  awbNo ,
                  consignorCode ,
                  packagingStatus ,
                  packagingId ,
                  runSheetNumber ,
                  shipmentStatus ,
                  shipmentAction ,
                  rejectedReason ,
                  actionTime ,
                  status 
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [
                            res.data.data[i].clientShipmentReferenceNumber,
                            res.data.data[i].clientRefId,
                            res.data.data[i].awbNo,
                            res.data.data[i].consignorCode,
                            res.data.data[i].packagingStatus,
                            res.data.data[i].packagingId,
                            res.data.data[i].runSheetNumber,
                            res.data.data[i].shipmentStatus,
                            res.data.data[i].shipmentAction,
                            res.data.data[i].rejectedReason,
                            res.data.data[i].actionTime,
                            res.data.data[i].status,
                        ], (sqlTxn, _res) => {
                            // console.log(`\n Data Added to local db successfully 213`);
                            // console.log(res);
                        }, error => {
                            console.log('error on adding data ' + error.message);
                        },);
                    });
                }
                m++;
                // console.log('value of m2 '+m);
                // viewDetails2();
                // setIsLoading(false);
            }, error => {
                console.log(error);
            },);
        })();
    };
    const createTables02 = () => {
      db.transaction(txn => {
          txn.executeSql('DROP TABLE IF EXISTS SellerMainScreenDetailsDelivery', []);
          txn.executeSql(`CREATE TABLE IF NOT EXISTS SellerMainScreenDetailsDelivery( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientShipmentReferenceNumber VARCHAR(200),
        clientRefId VARCHAR(200),
        awbNo VARCHAR(200),
        consignorCode VARCHAR(200),
        packagingStatus VARCHAR(200),
        packagingId VARCHAR(200),
        runSheetNumber VARCHAR(200),
        shipmentStatus VARCHAR(200),
        shipmentAction VARCHAR(200),
        rejectedReason VARCHAR(200),
        actionTime VARCHAR(200),
        status VARCHAR(200)
      )`, [], (sqlTxn, res) => {
              // console.log("table created successfully details213 ");
              // loadAPI_Data();
          }, error => {
              console.log('error on creating table ' + error.message);
          },);
      });
  };
  const loadAPI_Data02 = () => {
      // setIsLoading(!isLoading);
      (async () => {
          await axios.get(`https://bkedtest.logistiex.com/SellerMainScreen/workload/${userId}`).then(res => {
              createTables02();
              console.log('API 02 OK: ' + res.data.data.length);
              for (let i = 0; i < res.data.data.length; i++) {  //console.log(res.data.data[i].shipmentStatus);
                  db.transaction(txn => {
                      txn.executeSql(`INSERT OR REPLACE INTO SellerMainScreenDetailsDelivery( 
                clientShipmentReferenceNumber ,
                clientRefId ,
                awbNo ,
                consignorCode ,
                packagingStatus ,
                packagingId ,
                runSheetNumber ,
                shipmentStatus ,
                shipmentAction ,
                rejectedReason ,
                actionTime ,
                status 
              ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [
                          res.data.data[i].clientShipmentReferenceNumber,
                          res.data.data[i].clientRefId,
                          res.data.data[i].awbNo,
                          res.data.data[i].consignorCode,
                          res.data.data[i].packagingStatus,
                          res.data.data[i].packagingId,
                          res.data.data[i].runSheetNumber,
                          res.data.data[i].shipmentStatus,
                          res.data.data[i].shipmentAction,
                          res.data.data[i].rejectedReason,
                          res.data.data[i].actionTime,
                          res.data.data[i].status,
                      ], (sqlTxn, _res) => {
                          // console.log(`\n Data Added to local db successfully 213`);
                          // console.log(res);
                      }, error => {
                          console.log('error on adding data ' + error.message);
                      },);
                  });
              }
              m++;
              // console.log('value of m2 '+m);
              // viewDetails2();
              // setIsLoading(false);
          }, error => {
              console.log(error);
          },);
      })();
  };
    const viewDetails2 = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails', [], (tx1, results) => {
                // let temp = [];
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                    // var address121 = results.rows.item(i).consignorAddress;
                    // var address_json = JSON.parse(address121);
                    // console.log(typeof (address_json));
                    // console.log("Address from local db : " + address_json.consignorAddress1 + " " + address_json.consignorAddress2);
                    // ToastAndroid.show('consignorName:' + results.rows.item(i).consignorName + "\n" + 'PRSNumber : ' + results.rows.item(i).PRSNumber, ToastAndroid.SHORT);
                    // ToastAndroid.show("Sync Successful"+ results.rows.item(i).clientShipmentReferenceNumber,ToastAndroid.SHORT);
                // }
                // ToastAndroid.show('Sync Successful', ToastAndroid.SHORT);

                // m++;
                // console.log("Data from Local Database1 : \n ", JSON.stringify(temp, null, 4));
                // console.log('Table2 DB OK :', temp.length);
            },);
        });
    };


    const createTables10 = () => {
      db.transaction(txn => {
          txn.executeSql('DROP TABLE IF EXISTS SellerMainScreenDetailsRTO', []);
          txn.executeSql(`CREATE TABLE IF NOT EXISTS SellerMainScreenDetailsRTO( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientShipmentReferenceNumber VARCHAR(200),
        clientRefId VARCHAR(200),
        awbNo VARCHAR(200),
        consignorCode VARCHAR(200),
        packagingStatus VARCHAR(200),
        packagingId VARCHAR(200),
        runSheetNumber VARCHAR(200),
        shipmentStatus VARCHAR(200),
        shipmentAction VARCHAR(200),
        rejectedReason VARCHAR(200),
        actionTime VARCHAR(200),
        status VARCHAR(200)
      )`, [], (sqlTxn, res) => {
              // console.log("table created successfully details213 ");
              // loadAPI_Data();
          }, error => {
              console.log('error on creating table ' + error.message);
          },);
      });
  };
  const loadAPI_Data10 = () => {
      // setIsLoading(!isLoading);
      (async () => {
          await axios.get(`https://bkedtest.logistiex.com/SellerMainScreen/workload/${userId}`).then(res => {
              createTables10();
              // console.log('Table10 API OK 123: ' + res.data.data.length);
              for (let i = 0; i < res.data.data.length; i++) { // console.log(res.data.data[i].consignorCode);
                 if(res.data.data[i].shipmentStatus === "RTO"){
                  db.transaction(txn => {
                    txn.executeSql(`INSERT OR REPLACE INTO SellerMainScreenDetailsRTO( 
              clientShipmentReferenceNumber ,
              clientRefId ,
              awbNo ,
              consignorCode ,
              packagingStatus ,
              packagingId ,
              runSheetNumber ,
              shipmentStatus ,
              shipmentAction ,
              rejectedReason ,
              actionTime ,
              status 
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [
                        res.data.data[i].clientShipmentReferenceNumber,
                        res.data.data[i].clientRefId,
                        res.data.data[i].awbNo,
                        res.data.data[i].consignorCode,
                        res.data.data[i].packagingStatus,
                        res.data.data[i].packagingId,
                        res.data.data[i].runSheetNumber,
                        res.data.data[i].shipmentStatus,
                        res.data.data[i].shipmentAction,
                        res.data.data[i].rejectedReason,
                        res.data.data[i].actionTime,
                        'Rejected',
                    ], (sqlTxn, _res) => {
                        // console.log(`\n Data Added to local db successfully 213`);
                        // console.log(res);
                    }, error => {
                        console.log('error on adding data ' + error.message);
                    },);
                });
                 }
              }
              viewDetails10();
              // setIsLoading(false);
          }, error => {
              console.log(error);
          },);
      })();
  };
  const viewDetails10 = () => {
      db.transaction(tx => {
          tx.executeSql('SELECT * FROM SellerMainScreenDetailsRTO', [], (tx1, results) => {
              let temp = [];
              for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
                  // var address121 = results.rows.item(i).consignorAddress;
                  // var address_json = JSON.parse(address121);
                  // console.log(typeof (address_json));
                  // console.log("Address from local db : " + address_json.consignorAddress1 + " " + address_json.consignorAddress2);
                  // ToastAndroid.show('consignorName:' + results.rows.item(i).consignorName + "\n" + 'PRSNumber : ' + results.rows.item(i).PRSNumber, ToastAndroid.SHORT);
                  // ToastAndroid.show("Sync Successful"+ results.rows.item(i).clientShipmentReferenceNumber,ToastAndroid.SHORT);
              }
              // ToastAndroid.show('Sync Successful', ToastAndroid.SHORT);
              // m++;
              // console.log("Data from Local Database1 : \n ", JSON.stringify(temp, null, 4));
              // console.log('Table2 DB OK :', temp.length);
          },);
      });
  };

    // Table 3
    const createTables3 = () => {
        db.transaction(txn => {
            txn.executeSql('DROP TABLE IF EXISTS ShipmentRejectReasons', []);
            txn.executeSql('CREATE TABLE IF NOT EXISTS ShipmentRejectReasons(_id ID VARCHAR(100) PRIMARY KEY ,shipmentExceptionReasonID VARCHAR(200),shipmentExceptionReasonName VARCHAR(200),shipmentExceptionReasonUserID VARCHAR(200),disable VARCHAR(20),createdAt VARCHAR(200),updatedAt VARCHAR(200),__v INT(10))', [], (sqlTxn, res) => {
                // console.log('table 3 created successfully');
                // loadAPI_Data();
            }, error => {
                console.log('error on creating table ' + error.message);
            },);
        });
    };
    const loadAPI_Data3 = () => {
        // setIsLoading(!isLoading);
        createTables3();
        (async () => {
            await axios.get('https://bkedtest.logistiex.com/ADupdatePrams/getUSER').then(res => {
                // console.log('Table3 API OK: ' + res.data.length);
                // console.log(res.data);
                for (let i = 0; i < res.data.length; i++) {
                    db.transaction(txn => {
                        txn.executeSql('INSERT OR REPLACE INTO ShipmentRejectReasons( _id,shipmentExceptionReasonID,shipmentExceptionReasonName,shipmentExceptionReasonUserID,disable,createdAt,updatedAt,__v) VALUES (?,?,?,?,?,?,?,?)', [
                            res.data[i]._id,
                            res.data[i].shipmentExceptionReasonID,
                            res.data[i].shipmentExceptionReasonName,
                            res.data[i].shipmentExceptionReasonUserID,
                            res.data[i].disable,
                            res.data[i].createdAt,
                            res.data[i].updatedAt,
                            res.data[i].__v,
                        ], (sqlTxn, _res) => {
                            // console.log('\n Data Added to local db 3 ');
                            // console.log(_res);
                        }, error => {
                            console.log('error on adding data ' + error.message);
                        },);
                    });
                }
                m++;
                // console.log('value of m3 '+m);
                // viewDetails3();
                // setIsLoading(false);
            }, error => {
                console.log(error);
            },);
        })();
    };
    const viewDetails3 = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM ShipmentRejectReasons', [], (tx1, results) => {
                // let temp = [];
                // console.log(results.rows.length);
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                // }

                // m++;
                // ToastAndroid.show('Sync Successful3', ToastAndroid.SHORT);
                // console.log('Data from Local Database 3: \n ', JSON.stringify(temp, null, 4),);
                // console.log('Table3 DB OK:', temp.length);
            },);
        });
    };

    // Table 4
    const createTables4 = () => {
        db.transaction(txn => {
            txn.executeSql('DROP TABLE IF EXISTS ClosePickupReasons', []);
            txn.executeSql('CREATE TABLE IF NOT EXISTS ClosePickupReasons( _id ID VARCHAR(100) PRIMARY KEY,pickupFailureReasonID VARCHAR(50),pickupFailureReasonName VARCHAR(200),pickupFailureReasonUserID VARCHAR(50),pickupFailureReasonActiveStatus VARCHAR(20),pickupFailureReasonGroupID VARCHAR(50),pickupFailureReasonGeoFence VARCHAR(20),pickupFailureReasonOTPenable VARCHAR(20),pickupFailureReasonCallMandatory VARCHAR(20),pickupFailureReasonPickupDateEnable VARCHAR(20),pickupFailureReasonGroupName VARCHAR(200),disable VARCHAR(20),createdAt VARCHAR(200),updatedAt VARCHAR(200),__v INT(10))', [], (sqlTxn, res) => {
                // console.log('table 4 created successfully');
                // loadAPI_Data();
            }, error => {
                console.log('error on creating table ' + error.message);
            },);
        });
    };
    const loadAPI_Data4 = () => {
        // setIsLoading(!isLoading);
        createTables4();
        (async () => {
            await axios.get('https://bkedtest.logistiex.com/ADupdatePrams/getUPFR').then(res => {
                // console.log('Table4 API OK: ' + res.data.length);
                // console.log(res.data);
                for (let i = 0; i < res.data.length; i++) {
                    db.transaction(txn => {
                        txn.executeSql(`INSERT OR REPLACE INTO ClosePickupReasons( _id,pickupFailureReasonID,pickupFailureReasonName,pickupFailureReasonUserID,pickupFailureReasonActiveStatus,pickupFailureReasonGroupID,pickupFailureReasonGeoFence,pickupFailureReasonOTPenable,pickupFailureReasonCallMandatory,pickupFailureReasonPickupDateEnable,pickupFailureReasonGroupName,disable,createdAt,updatedAt,__v
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
                            res.data[i]._id,
                            res.data[i].pickupFailureReasonID,
                            res.data[i].pickupFailureReasonName,
                            res.data[i].pickupFailureReasonUserID,
                            res.data[i].pickupFailureReasonActiveStatus,
                            res.data[i].pickupFailureReasonGroupID,
                            res.data[i].pickupFailureReasonGeoFence,
                            res.data[i].pickupFailureReasonOTPenable,
                            res.data[i].pickupFailureReasonCallMandatory,
                            res.data[i].pickupFailureReasonPickupDateEnable,
                            res.data[i].pickupFailureReasonGroupName,
                            res.data[i].disable,
                            res.data[i].createdAt,
                            res.data[i].updatedAt,
                            res.data[i].__v,
                        ], (sqlTxn, _res) => {
                            // console.log('\n Data Added to local db 4 ');
                            // console.log(res);
                        }, error => {
                            console.log('error on adding data ' + error.message);
                        },);
                    });
                }
                m++;
                // console.log('value of m4 '+m);

                // viewDetails4();
                // setIsLoading(false);
            }, error => {
                console.log(error);
            },);
        })();
    };
    const viewDetails4 = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM ClosePickupReasons', [], (tx1, results) => {
                // let temp = [];
                // console.log(results.rows.length);
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                // }
                // ToastAndroid.show('Sync Successful4', ToastAndroid.SHORT);
                // console.log('Data from Local Database 4: \n ', JSON.stringify(temp, null, 4),);
                // console.log('Data from Local Database 4: \n ',temp);

                // m++;
                // console.log('Table4 DB OK:', temp.length);
            });
        });
    };

    // Table 5
    const createTables5 = () => {
        db.transaction(txn => {
            txn.executeSql('DROP TABLE IF EXISTS NotAttemptReasons', []);
            txn.executeSql('CREATE TABLE IF NOT EXISTS NotAttemptReasons(_id ID VARCHAR(200) PRIMARY KEY,reasonID VARCHAR(200),reasonName VARCHAR(200),reasonUserID VARCHAR(200),disable VARCHAR(200),createdAt VARCHAR(200),updatedAt VARCHAR(200),__v INT(10))', [], (sqlTxn, res) => {
                // console.log('table 5 created successfully');
                // loadAPI_Data();
            }, error => {
                console.log('error on creating table ' + error.message);
            },);
        });
    };
    const loadAPI_Data5 = () => {
        // setIsLoading(!isLoading);
        createTables5();
        (async () => {
            await axios.get('https://bkedtest.logistiex.com/ADupdatePrams/getNotAttemptedReasons').then(res => {
                // console.log('Table5 API OK:' , res.data.data.length);
                // console.log(res.data);
                for (let i = 0; i < res.data.data.length; i++) {
                    db.transaction(txn => {
                        txn.executeSql(`INSERT OR REPLACE INTO NotAttemptReasons(_id,reasonID,reasonName,reasonUserID,disable,createdAt,updatedAt,__v
                          ) VALUES (?,?,?,?,?,?,?,?)`, [
                            res.data.data[i]._id,
                            res.data.data[i].reasonID,
                            res.data.data[i].reasonName,
                            res.data.data[i].reasonUserID,
                            res.data.data[i].disable,
                            res.data.data[i].createdAt,
                            res.data.data[i].updatedAt,
                            res.data.data[i].__v,

                        ], (sqlTxn, _res) => {
                            // console.log('\n Data Added to local db 5');
                            // console.log(res);
                        }, error => {
                            console.log('error on adding data ' + error.message);
                        },);
                    });
                }
                m++;
                // console.log('value of m5 '+m);

                // viewDetails5();
                // setIsLoading(false);
            }, error => {
                console.log(error);
            },);
        })();
    };
    const viewDetails5 = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM NotAttemptReasons', [], (tx1, results) => {
                // let temp = [];
                // // console.log(results.rows.length);
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                // }
                // m++;
                // ToastAndroid.show("Sync Successful",ToastAndroid.SHORT);
                // console.log('Data from Local Database 5: \n ', temp);
                // console.log('Table 5 DB OK:', temp.length);
            });
        });
    };

    // Table 6
    const createTables6 = () => {
        db.transaction(txn => {
            txn.executeSql('DROP TABLE IF EXISTS PartialCloseReasons', []);
            txn.executeSql('CREATE TABLE IF NOT EXISTS PartialCloseReasons(_id ID VARCHAR(200) PRIMARY KEY,reasonID VARCHAR(200),reasonName VARCHAR(200),reasonUserID VARCHAR(200),disable VARCHAR(200),createdAt VARCHAR(200),updatedAt VARCHAR(200),__v INT(10))', [], (sqlTxn, res) => {
                // console.log('table 6 created successfully');
                // loadAPI_Data();
            }, error => {
                console.log('error on creating table ' + error.message);
            },);
        });
    };
    const loadAPI_Data6 = () => {
        // setIsLoading(!isLoading);
        createTables6();
        (async () => {
            await axios.get('https://bkedtest.logistiex.com/ADupdateprams/getPartialClosureReasons',).then(res => {
                // console.log('Table6 API OK: ' + res.data.data.length);
                // console.log(res.data);
                for (let i = 0; i < res.data.data.length; i++) {
                    db.transaction(txn => {
                        txn.executeSql(`INSERT OR REPLACE INTO PartialCloseReasons(_id,reasonID,reasonName,reasonUserID,disable,createdAt,updatedAt,__v
                          ) VALUES (?,?,?,?,?,?,?,?)`, [
                            res.data.data[i]._id,
                            res.data.data[i].reasonID,
                            res.data.data[i].reasonName,
                            res.data.data[i].reasonUserID,
                            res.data.data[i].disable,
                            res.data.data[i].createdAt,
                            res.data.data[i].updatedAt,
                            res.data.data[i].__v,
                        ], (sqlTxn, _res) => {
                            // console.log('\n Data Added to local db 6 ');
                            // console.log(res);
                        }, error => {
                            console.log('error on adding data ' + error.message);
                        },);
                    });
                }
                m++;
                // console.log('value of m6 '+m);

                viewDetails6();
                // setIsLoading(false);
            }, error => {
                console.log(error);
            },);
        })();
    };
    const viewDetails6 = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM PartialCloseReasons', [], (tx1, results) => {
                // let temp = [];
                // // console.log(results.rows.length);
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                // }
                // m++;
                if (m <= 5){
                  // ToastAndroid.show('Sync Successful',ToastAndroid.SHORT);
                  console.log('Waiting for ' + ( 6 - m ) + ' API to load. Plz wait...');
                  // m = 0;
                }
              //  else {
              //   console.log('Only ' + m + ' APIs loaded out of 6 ');
              // }
                // console.log('Data from Local Database 6 : \n ', temp);
                // console.log('Table6 DB OK:', temp.length);
            });
        });
    };

  const DisplayData = () => {
        axios.get(`https://bkedtest.logistiex.com/SellerMainScreen/getadditionalwork/${userId}`)
          .then(res => {
            setData(res.data);
            // console.log('dataDisplay', res.data);
          })
          .catch(error => {
            // console.log('Error Msg:', error);
          });
  };

  useEffect(() => {
    DisplayData();
  }, [userId]);


  return (
    <NativeBaseProvider>
      <Stack.Navigator
        initialRouteName={'Main'}
        key={'Main'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#004aad',
            // elevation: 0,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            // alignSelf: 'center',
          },
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="SellerSelection"
          component={SellerSelection}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

<Stack.Screen
          name="CloseReasonCode"
          component={CloseReasonCode}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

<Stack.Screen
          name="CloseTrip"
          component={CloseTrip}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

<Stack.Screen
          name="UpdateSellerCloseReasonCode"
          component={UpdateSellerCloseReasonCode}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />


<Stack.Screen
          name="ReturnHandoverRejectionTag"
          component={ReturnHandoverRejectionTag}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="Main"
          component={Main}
          options ={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Dashboard
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => {
                console.log('dashboard menu clicked');
                  navigation.dispatch(DrawerActions.openDrawer())
                }}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                 {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="NewSellerPickup"
          component={NewSellerPickup}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Pickups
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
            //  headerRight: () => (
            //         <NativeBaseProvider>
            //       {/* //     <Button  leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" />} > Sync</Button> */}
            //       <Button leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" color="white" />}onPress={() => sync11()
            //     }
            //       style={{
            //         marginTop:8.5,marginBottom:8, marginLeft: 10,marginRight:12,backgroundColor: '#004aad',width:30,height:38,alignSelf: 'center',
            //         borderRadius: 10,
            // }}
            // title="sync" name='Sync' ></Button>
            //       </NativeBaseProvider>
            //       )
          }}
        />
        <Stack.Screen
          name="SellerHandover"
          component={SellerHandover}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Handover
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="HandoverShipment"
          component={HandoverShipment}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Shipment
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="OpenBags"
          component={OpenBags}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Open Bags
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="PendingHandover"
          component={PendingHandover}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Pending Handover
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="HandOverSummary"
          component={HandOverSummary}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Handover Summary
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />

<Stack.Screen
          name="HandoverShipmentRTO"
          component={HandoverShipmentRTO}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                Seller Handover Scan
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="NewSellerSelection"
          component={NewSellerSelection}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Summary
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="ShipmentBarcode"
          component={ShipmentBarcode}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Scan Products
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="SellerDeliveries"
          component={SellerDeliveries}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Deliveries
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="SellerHandoverSelection"
          component={SellerHandoverSelection}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Handover
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="ScanShipment"
          component={ScanShipment}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Scan Shipment Barcode
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="CollectPOD"
          component={CollectPOD}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Deliveries
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="Dispatch"
          component={Dispatch}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Bag to Dispatch
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Map Navigation
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {
                    data.length ? (
                      <Badge
                    style={{
                      position: 'absolute',
                      fontSize: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    {data.length}
                  </Badge>
                    ):null
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="reject"
          component={Reject}
          options={{
            header: () => null,
          }}
        />

        <Stack.Screen
          name="POD"
          component={POD}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Pickup Summary
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="StartTrip"
          component={StartTrip}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Start Trip
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="EndTrip"
          component={EndTrip}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  End Trip
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="StartEndDetails"
          component={StartEndDetails}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Get Detail
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="NewSellerAdditionNotification"
          component={NewSellerAdditionNotification}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />
      </Stack.Navigator>

      {isLoading ? (
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
          <Text style={{color: 'white'}}>Syncing Data. Please Wait...</Text>
          <Lottie
            source={require('./src/assets/loading11.json')}
            autoPlay
            loop
            speed={1}
            //   progress={animationProgress.current}
          />
          <ProgressBar width={70} />
        </View>
      ) : null}
    </NativeBaseProvider>
  );
}
function CustomDrawerContent({navigation}) {
  const [language, setLanguage] = useState('');
  const [email, SetEmail] = useState('');
  const [name, setName] = useState('');
  const [TripValue, setTripValue] = useState('Start Trip');
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const data = JSON.parse(value);
        setName(data.UserName);
        SetEmail(data.UserEmail);
      } else {
        setName('');
        SetEmail('');
      }
      const StartEndTrip = await AsyncStorage.getItem('@StartEndTrip');
      if (StartEndTrip !== null) {
        const data = JSON.parse(StartEndTrip);
        console.log(data, 'dasdas');
        setTripValue(data);
        await AsyncStorage.removeItem('@StartEndTrip');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const StartValue = setInterval(() => {
      getData();
    }, 1000);
    return () => clearInterval(StartValue);
  }, []);

  const LogoutHandle = async () => {
    try {
      await AsyncStorage.removeItem('@storage_Key');
      await AsyncStorage.removeItem('@StartEndTrip');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <NativeBaseProvider>
      {email ? (
        <Box pt={4} px={4} key={'extra' + email}>
          <Avatar bg="#004aad" alignSelf="center" size="xl">
            <MaterialIcons
              name="account"
              style={{fontSize: 60, color: 'white'}}
            />
          </Avatar>
          <Heading alignSelf="center" mt={2}>
            {name}
          </Heading>
          <Text alignSelf="center">{email}</Text>
          <Button
            onPress={() => {
              LogoutHandle();
              navigation.navigate('Login');
              navigation.closeDrawer();
            }}
            mt={2}
            style={{backgroundColor: '#004aad'}}>
            Logout
          </Button>
        </Box>
      ) : (
        <Box pt={4} px={4}>
          <Button
            onPress={() => {
              navigation.navigate('Login');
              navigation.closeDrawer();
            }}
            mt={2}
            style={{backgroundColor: '#004aad'}}>
            Login
          </Button>
        </Box>
      )}
      {email ? (
        <View>
          <Divider my="4" />
          <Box px={4}>
            <Button
              variant="outline"
              onPress={() => {
                navigation.navigate('Main');
                navigation.closeDrawer();
              }}
              style={{color: '#004aad', borderColor: '#004aad'}}>
              <Text style={{color: '#004aad'}}>Home</Text>
            </Button>
            <Button
              variant="outline"
              onPress={() => {
                TripValue === 'Start Trip'
                  ? navigation.navigate('StartTrip')
                  : TripValue === 'End Trip'
                  ? navigation.navigate('EndTrip')
                  : navigation.navigate('StartEndDetails');
                navigation.closeDrawer();
              }}
              mt={4}
              style={{color: '#004aad', borderColor: '#004aad'}}>
              <Text style={{color: '#004aad'}}>{TripValue}</Text>
            </Button>

            
          </Box>
        </View>
      ) : null}
      <Divider my="4" />
      <Box px={4}>
        <Select
          selectedValue={language}
          minWidth="200"
          accessibilityLabel="Choose Language"
          placeholder="Choose Language"
          _selectedItem={{bg: '#004aad', color: 'white'}}
          mt={0}
          onValueChange={itemValue => setLanguage(itemValue)}>
          <Select.Item label="English (EN)" value="English" />
          <Select.Item label="Hindi (HI)" value="Hindi" />
          <Select.Item label="Marathi (MT)" value="Marathi" />
          <Select.Item label="Urdu (UD)" value="Urdu" />
          <Select.Item label="Telgu (TG)" value="Telgu" />
          <Select.Item label="Tamil (TL)" value="Tamil" />
        </Select>
      </Box>
      <Center style={{bottom: 0, position: 'absolute', left: '15%'}}>
        <Image
          style={{width: 200, height: 150}}
          source={require('./src/assets/image.png')}
          alt={'Logo Image'}
        />
      </Center>
    </NativeBaseProvider>
  );
}

export default function App({navigation}) {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="home"
        key={'home'}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="home"
          component={StackNavigators}
          options={{
            header: () => null,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
