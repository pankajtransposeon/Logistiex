/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, Alert} from 'react';
import {Text, View, ScrollView,ToastAndroid} from 'react-native';
import axios from 'axios';
import {Fab} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon} from 'native-base';
import Lottie from 'lottie-react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import {
    NativeBaseProvider,
    Box,
    Button,
    Center,
    Image,
    Heading,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
const db = openDatabase({name: 'rn_sqlite'});
import PieChart from 'react-native-pie-chart';
import { StyleSheet } from 'react-native';


export default function Main({navigation, route}) {

    const shipmentData = `https://bked.logistiex.com/SellerMainScreen/sellerList/${
        route.params.userId
    }`;
    // const userId = route.params.userId;

    const [data, setData] = useState(0);
    // const [data1, setData1] = useState(0);
    // const [data2, setData2] = useState('');

    const [spts, setSpts] = useState(0);
    const [spc, setSpc] = useState(1);
    const [spp, setSpp] = useState(1);
    const [spnp, setSpnp] = useState(1);
    const [spr, setSpr] = useState(1);
    const [SpARC,setSpARC] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          loadSellerPickupDetails();

        });
        return unsubscribe;
      }, [navigation]);


    // useEffect(() => {
    //     (async () => {
    //         loadSellerPickupDetails();
    //     })();
    // },[]);

    // const sync11 = () => {
    //     loadSellerPickupDetails();

    // };
    const loadSellerPickupDetails = async() => {
        setIsLoading(!isLoading);
        setSpp(1);
        setSpnp(1);
        setSpc(1);
        setSpr(1);
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => {
                // console.log('SP Total Seller : ' + results.rows.length);
                setSpts(results.rows.length);
            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails WHERE status IS Null', [], (tx1, results) => {
                // let temp = [];
                // console.log('SP Pending : ' + results.rows.length);
                setSpp(results.rows.length);
                // setIsLoading(false);
                // ToastAndroid.show("Loading Successfull",ToastAndroid.SHORT);
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                // }
                // console.log('Data from Local Database : \n ', JSON.stringify(temp, null, 4));
                // setData(temp);
            });
        });

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where status="accepted"', [], (tx1, results) => {
                let temp = [];
                // console.log('SP Completed : ' + results.rows.length);
                setSpc(results.rows.length);
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                // }
                // // console.log('Data from Local Database : \n ', JSON.stringify(temp, null, 4));
                // setData(temp);
            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where status="accepted" OR status="rejected"', [], (tx1, results) => {
                // let temp = [];
                // console.log('SP Completed : ' + results.rows.length);
                setSpARC(results.rows.length);
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                // }
                // // console.log('Data from Local Database : \n ', JSON.stringify(temp, null, 4));
                // setData(temp);
            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where status="notPicked"', [], (tx1, results) => {
                let temp = [];
                // console.log('SP Not Picked : ' + results.rows.length);
                setSpnp(results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
                // console.log('Data from Local Database125 : \n ', JSON.stringify(temp, null, 4));
                // setData(temp);
            });
        });

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where status="rejected"', [], (tx1, results) => {
                // let temp = [];
                // console.log('SP Rejected : ' + results.rows.length);
                setSpr(results.rows.length);
                setIsLoading(false);
                ToastAndroid.show("Loading Successfull",ToastAndroid.SHORT);
                // for (let i = 0; i < results.rows.length; ++i) {
                //     temp.push(results.rows.item(i));
                // }
                // console.log('Data from Local Database : \n ', JSON.stringify(temp, null, 4));
                // setData(temp);
            });
        });
       
    };

    const value = {
        Accepted: 0,
        Rejected: 0,
    };

    const createTables = () => {
        db.transaction(txn => {
            txn.executeSql('DROP TABLE IF EXISTS categories', []);
            txn.executeSql('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, clientShipmentReferenceNumber VARCHAR(50), packagingId VARCHAR(50), packagingStatus VARCHAR(50), consignorCode VARCHAR(50), consignorContact VARCHAR(50), PRSNumber VARCHAR(50), ForwardPickups VARCHAR(50), ScanStatus INT(10), UploadStatus INT(10))', [], (sqlTxn, res) => { // console.log("table created successfully");
            }, error => {
                console.log('error on creating table ' + error.message);
            },);
        });
    };

    const addCategory = (clientShipmentReferenceNumber, packagingId, packagingStatus, consignorCode, consignorContact, PRSNumber, ForwardPickups, ScanStatus, UploadStatus) => {
        // console.log(clientShipmentReferenceNumber, packagingId, packagingStatus, consignorCode, consignorContact, PRSNumber, ForwardPickups, ScanStatus, UploadStatus);
        if (!clientShipmentReferenceNumber && !packagingId && !packagingStatus && !consignorCode && !consignorContact && !PRSNumber && !ForwardPickups && !ScanStatus && !UploadStatus) { // eslint-disable-next-line no-alert
            alert('Enter category');
            return false;
        }

        db.transaction(txn => {
            txn.executeSql('INSERT INTO categories (clientShipmentReferenceNumber, packagingId, packagingStatus , consignorCode, consignorContact, PRSNumber, ForwardPickups,ScanStatus,UploadStatus) VALUES (?,?,?,?,?,?,?,?,?)', [
                clientShipmentReferenceNumber,
                packagingId,
                packagingStatus,
                consignorCode,
                consignorContact,
                PRSNumber,
                ForwardPickups,
                ScanStatus,
                UploadStatus,
            ], (sqlTxn, res) => {
                // console.log('category added successfully');
            }, error => {
                console.log('error on adding category ' + error.message);
            },);
        });
    };

    const storeUser = async () => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { // removeUser();
        storeUser();
    }, []);


    // db.transaction(txn => {
    //     txn.executeSql('DROP TABLE IF EXISTS Sync1', []);
    //     txn.executeSql('CREATE TABLE IF NOT EXISTS Sync1(userId ID VARCHAR(30) PRIMARY KEY  ,consignorPickupsList INT(15), CustomerPickupsList VARCHAR(50))', [], (sqlTxn, res) => {
    //         console.log('table created successfully');
    //     }, error => {
    //         console.log('error on creating table ' + error.message);
    //     },);
    // });


    // db.transaction(txn => {
    //     txn.executeSql('INSERT OR REPLACE INTO Sync1 (userId ,consignorPickupsList , CustomerPickupsList) VALUES (?,?,?)', [
    //         userId, data1, data2,
    //     ], (sqlTxn, res) => {
    //         console.log('Data Added to local db successfully');
    //         console.log(res);
    //         console.log(data1 + ' ' + data2);
    //     }, error => {
    //         console.log('error on adding data ' + error.message);
    //     },);
    // });

    // const viewDetails = () => {
    //     db.transaction((tx) => {
    //         tx.executeSql('SELECT * FROM Sync1 where userId=?', [userId], (tx1, results) => {
    //             let temp = [];
    //             for (let i = 0; i < results.rows.length; ++i) {
    //                 temp.push(results.rows.item(i));
    //                 console.log(results.rows.item(i).consignorPickupsList);
    //                 setData1(results.rows.item(i).consignorPickupsList);
    //                 setData2(results.rows.item(i).CustomerPickupsList);
    //                 ToastAndroid.show('consignorPickupsList :' + results.rows.item(i).consignorPickupsList + '\n' + 'CustomerPickupsList : ' + results.rows.item(i).CustomerPickupsList, ToastAndroid.SHORT);
    //             }
    //             // console.log(temp);
    //             // console.log(tx1);
    //         });
    //     });
    // };

    useEffect(() => {
        createTables();
        (async () => {
            await axios.get(`https://bked.logistiex.com/SellerMainScreen/getMSD/${
                route.params.userId
            }`).then((res) => {
                setData(res.data.consignorPickupsList);
            }, (error) => {
                alert(error);
            });
        })();

        (async () => {
            await axios.get(shipmentData).then((res) => {
                res.data.map(m => {
                    axios.get(`https://bked.logistiex.com/SellerMainScreen/getSellerDetails/${
                        m.consignorCode
                    }`).then((d) => {
                        d.data.totalPickups.map((val) => {
                            addCategory(val.clientShipmentReferenceNumber, val.packagingId, val.packagingStatus, m.consignorCode, m.consignorContact, m.PRSNumber, m.ForwardPickups, 0, 0);
                        });
                    });
                });

            }, (error) => {
                alert(error);
            });
        })();
    }, []);

    // useEffect(() => {
    //     (async () => {
    //         await axios.get(getData).then((res) => {
    //             setData1(res.data.consignorPickupsList);
    //             setData2(res.data.CustomerPickupsList);
    //             console.log(res.data.CustomerPickupsList);
    //             console.log(res.data.consignorPickupsList);
    //             // createTables();
    //         }, (error) => {
    //             Alert.alert(error);
    //         });
    //     })();
    // }, []);
    const dashboardData = [
        {
            title: 'Seller Pickups',
            totalUsers: spts,
            pendingOrder: spp,
            completedOrder: spc,
            rejectedOrder: spr,
            notPicked: spnp,
        }, {
            title: 'Seller Deliveries',
            totalUsers: 14,
            pendingOrder: 200,
            completedOrder: 204,
            rejectedOrder: 83,
            notPicked: 70,
        }, {
            title: 'Customer Pickups',
            totalUsers: 21,
            pendingOrder: 23,
            completedOrder: 123,
            rejectedOrder: 112,
            notPicked: 70,
        }, {
            title: 'Customer Deliveries',
            totalUsers: 9,
            pendingOrder: 200,
            completedOrder: 303,
            rejectedOrder: 32,
            notPicked: 70,
        },
    ];



  return (
    <NativeBaseProvider>
      <ScrollView>
      <Box flex={1} bg="gray.300" p={4}>
        {dashboardData.map((it, index)=>{
        return (
        <Box pt={4} mb="6" rounded="md" bg="white" key={index} >
          <Box w="100%" flexDir="row" justifyContent="space-between" mb={4} px={4}>
            <Box w="45%">
              <Heading size="sm" mb={4}>{it.title}</Heading>
              <PieChart
                widthAndHeight={120}
                series={[it.completedOrder, it.pendingOrder, it.notPicked, it.rejectedOrder]}
                sliceColor={['#4CAF50', '#2196F3','#FFEB3B', '#F44336' ]}
                doughnut={true}
                coverRadius={0.6}
                coverFill={'#FFF'}
              />
            </Box>
            <View style={{width: '50%'}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                <Heading size="sm">{(it.title === 'Seller Pickups' || it.title === 'Seller Deliveries') ? 'Total Sellers' : 'Total Customers'}</Heading>
                <Heading size="sm">{it.totalUsers}</Heading>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 15, height: 15, backgroundColor: '#4CAF50', borderRadius: 100, marginTop: 4}} />
                  <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 14}}>Completed</Text>
                </View>
                <Text style={{fontWeight: '500', fontSize: 14}}>{it.completedOrder}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 15, height: 15, backgroundColor: '#2196F3', borderRadius: 100, marginTop: 4}} />
                  <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 14}}>Pending</Text>
                </View>
                <Text style={{fontWeight: '500', fontSize: 14}}>{it.pendingOrder}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 15, height: 15, backgroundColor: '#FFEB3B', borderRadius: 100, marginTop: 4}} />
                  <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 14}}>Not Picked</Text>
                </View>
                <Text style={{fontWeight: '500', fontSize: 14}}>{it.notPicked}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 15, height: 15, backgroundColor: '#F44336', borderRadius: 100, marginTop: 4}} />
                  <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 14}}>Rejected</Text>
                </View>
                <Text style={{fontWeight: '500', fontSize: 14}}>{it.rejectedOrder}</Text>
              </View>
            </View>
          </Box>
          {it.title==='Seller Deliveries'?
            <Button w="100%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('SellerHandover',{count : data, userId : route.params.userId})}>New Pickup</Button>
            :<Button w="100%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('NewSellerPickup',{count : data, userId : route.params.userId})}>New Pickup</Button>
            }
        </Box>
        );
        })}
        <Center>
          <Image style={{ width: 150, height: 100 }} source={require('../assets/image.png')} alt={'Logo Image'} />
        </Center>
      </Box>
      </ScrollView>
      {/* <Fab onPress={()=>sync11()} position="absolute" size="sm" style={{backgroundColor: '#004aad'}} icon={<Icon color="white" as={<MaterialIcons name="sync" />} size="sm" />} /> */}
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
          <Text style={{color: 'white'}}>Loading...</Text>
          <Lottie
            source={require('../assets/loading11.json')}
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
