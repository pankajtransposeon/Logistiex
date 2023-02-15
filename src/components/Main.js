/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, Alert} from 'react';
import {Text, View, ScrollView,ToastAndroid} from 'react-native';
import axios from 'axios';
import {Fab} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon} from 'native-base';
import Lottie from 'lottie-react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import App from '../../App';
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
    // const userId = route.params.userId;

    const [data, setData] = useState(0);
    // const [data1, setData1] = useState(0);
    // const [data2, setData2] = useState('');

    const [spts, setSpts] = useState(0);
    const [spc, setSpc] = useState(1);
    const [spp, setSpp] = useState(1);
    const [spnp, setSpnp] = useState(1);
    const [spr, setSpr] = useState(1);
    const [spts1, setSpts1] = useState(0);
    const [spc1, setSpc1] = useState(1);
    const [spp1, setSpp1] = useState(1);
    const [spnp1, setSpnp1] = useState(1);
    const [spr1, setSpr1] = useState(1);
    const [SpARC,setSpARC] = useState(0);
    const [SpARC1,setSpARC1] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          loadSellerPickupDetails();
        });
        return unsubscribe;
      }, [navigation]);


      const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('refresh11');
            if (value === 'refresh') {
                loadSellerPickupDetails();
            } 
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const StartValue = setInterval(() => {
            getData();
        }, 100);
        return () => clearInterval(StartValue);
    }, []);
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        loadSellerDeliveryDetails();
      });
      return unsubscribe;
    }, [navigation]);


    const getData1 = async () => {
      try {
          const value = await AsyncStorage.getItem('refresh11');
          if (value === 'refresh') {
           loadSellerDeliveryDetails();
          } 
      } catch (e) {
          console.log(e);
      }
  };

  useEffect(() => {
      const StartValue = setInterval(() => {
          getData1();
      }, 100);
      return () => clearInterval(StartValue);
  }, []);

    const loadSellerPickupDetails = async() => {
        setSpp(1);
        setSpnp(1);
        setSpc(1);
        setSpr(1);
        await AsyncStorage.setItem('refresh11', 'notrefresh');
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => {
                setSpts(results.rows.length);
            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails WHERE shipmentStatus="WFP" AND status IS NULL', [], (tx1, results) => {
                setSpp(results.rows.length);
            });
        });

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where shipmentStatus="WFP" AND status="accepted"', [], (tx1, results) => {
                let temp = [];
                setSpc(results.rows.length);
            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where shipmentStatus="WFP" AND status="accepted" OR status="rejected"', [], (tx1, results) => {
                setSpARC(results.rows.length);
            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where shipmentStatus="WFP" AND status="notPicked"', [], (tx1, results) => {
                let temp = [];
                setSpnp(results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
            });
        });

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SellerMainScreenDetails where status="rejected"', [], (tx1, results) => {
                setSpr(results.rows.length);
                setIsLoading(false);
            });
        });
       
    };
    const loadSellerDeliveryDetails = async() => {
      setSpp1(1);
      setSpnp1(1);
      setSpc1(1);
      setSpr1(1);
      await AsyncStorage.setItem('refresh11', 'notrefresh');
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM SellerMainScreenDetailsDelivery WHERE shipmentStatus="RTO" AND status IS NULL', [], (tx1, results) => {
            setSpp1(results.rows.length);
        });
    });

    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM SellerMainScreenDetailsDelivery WHERE status="accepted"', [], (tx1, results) => {
            let temp = [];
            setSpc1(results.rows.length);
        });
    });
    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM SellerMainScreenDetailsDelivery WHERE status="notDelivered"', [], (tx1, results) => {
            let temp = [];
            setSpnp1(results.rows.length);
            for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
            }
        });
    });

    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM SellerMainScreenDetailsDelivery WHERE status="rejected"', [], (tx1, results) => {
            setSpr1(results.rows.length);
            setIsLoading1(false);
        });
    });
     
  };

    const value = {
        Accepted: 0,
        Rejected: 0,
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
            totalUsers: spts,
            pendingOrder: spp1,
            completedOrder: spc1,
            rejectedOrder: spr1,
            notPicked: spnp1,
        },
        //  {
        //     title: 'Customer Pickups',
        //     totalUsers: 21,
        //     pendingOrder: 23,
        //     completedOrder: 123,
        //     rejectedOrder: 112,
        //     notPicked: 70,
        // }, {
        //     title: 'Customer Deliveries',
        //     totalUsers: 9,
        //     pendingOrder: 200,
        //     completedOrder: 303,
        //     rejectedOrder: 32,
        //     notPicked: 70,
        // },
    ];



  return (
    <NativeBaseProvider>
      <Box flex={1} bg="gray.300">
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
                  <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 14, color: 'black'}}>Completed</Text>
                </View>
                <Text style={{fontWeight: '500', fontSize: 14, color: 'black'}}>{it.completedOrder}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 15, height: 15, backgroundColor: '#2196F3', borderRadius: 100, marginTop: 4}} />
                  <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 14, color: 'black'}}>Pending</Text>
                </View>
                <Text style={{fontWeight: '500', fontSize: 14, color: 'black'}}>{it.pendingOrder}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 15, height: 15, backgroundColor: '#FFEB3B', borderRadius: 100, marginTop: 4}} />
                  {it.title==='Seller Deliveries'?
                  <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 14, color: 'black'}}>Not Delivered</Text>
                  :
                  <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 14, color: 'black'}}>Not Picked</Text>
                  }
                </View>
                <Text style={{fontWeight: '500', fontSize: 14, color: 'black'}}>{it.notPicked}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 15, height: 15, backgroundColor: '#F44336', borderRadius: 100, marginTop: 4}} />
                  <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 14, color: 'black'}}>Rejected</Text>
                </View>
                <Text style={{fontWeight: '500', fontSize: 14, color: 'black'}}>{it.rejectedOrder}</Text>
              </View>
            </View>
          </Box>
          {it.title==='Seller Deliveries'?
            <Button w="100%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('SellerDeliveries',{Pending:spp1})}>New Delivery</Button>
            :<Button w="100%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('NewSellerPickup')}>New Pickup</Button>
            }
        </Box>        
        );
        })}
        <Button w="100%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('SellerHandover')}>Start Handover</Button>
        {/* <Button w="100%" size="lg" bg="#004aad" mt={-5} onPress={()=>navigation.navigate('SellerHandover')}>Seller Handover</Button> */}
        {/* <Button w="100%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('SellerHandover')}>Start Handover</Button> */}
        <Center>
          <Image style={{ width: 150, height: 100 }} source={require('../assets/image.png')} alt={'Logo Image'} />
        </Center>
      </Box>
      </ScrollView>
      {/* <Fab onPress={()=>sync11()} position="absolute" size="sm" style={{backgroundColor: '#004aad'}} icon={<Icon color="white" as={<MaterialIcons name="sync" />} size="sm" />} /> */}
      {(isLoading && isLoading1) ? (
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
    </Box></NativeBaseProvider>
  );
}