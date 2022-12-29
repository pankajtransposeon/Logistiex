/* eslint-disable prettier/prettier */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState,Alert } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Text, TouchableOpacity, View, ToastAndroid } from 'react-native';
import axios from 'axios';
import { ArrowForwardIcon, NativeBaseProvider, Box, Icon, Button, Center, Image} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from "react-native-sqlite-storage";
const db = openDatabase({name: "rn_sqlite"});

export default function Main({navigation, route}) {

  const getData = `https://bked.logistiex.com/SellerMainScreen/getMSD/${route.params.userId}`;
  const shipmentData = `https://bked.logistiex.com/SellerMainScreen/getSellerList/${route.params.userId}`;
  const userId = route.params.userId;

  const [data, setData]   = useState(0);
  const [data1, setData1] = useState(0);
  const [data2, setData2] = useState("");

  const value = {
    Accepted: 0,
    Rejected: 0
  };

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS categories', []);
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, clientShipmentReferenceNumber VARCHAR(50), packagingId VARCHAR(50), packagingStatus VARCHAR(50), consignorCode VARCHAR(50), consignorContact VARCHAR(50), PRSNumber VARCHAR(50), ForwardPickups VARCHAR(50), ScanStatus INT(10), UploadStatus INT(10))`,
        [],
        (sqlTxn, res) => {
          console.log("table created successfully");
        },
        error => {
          console.log("error on creating table " + error.message);
        },
      );
    });
  };

  const addCategory = (clientShipmentReferenceNumber, packagingId, packagingStatus , consignorCode, consignorContact, PRSNumber, ForwardPickups,ScanStatus,UploadStatus) => {
    console.log(clientShipmentReferenceNumber, packagingId, packagingStatus , consignorCode, consignorContact, PRSNumber, ForwardPickups,ScanStatus,UploadStatus);
    if (!clientShipmentReferenceNumber && !packagingId && !packagingStatus && !consignorCode && !consignorContact && !PRSNumber && !ForwardPickups && !ScanStatus && !UploadStatus) {
      alert("Enter category");
      return false;
    }

    db.transaction(txn => {
      txn.executeSql(
        `INSERT INTO categories (clientShipmentReferenceNumber, packagingId, packagingStatus , consignorCode, consignorContact, PRSNumber, ForwardPickups,ScanStatus,UploadStatus) VALUES (?,?,?,?,?,?,?,?,?)`,
        [clientShipmentReferenceNumber, packagingId, packagingStatus , consignorCode, consignorContact, PRSNumber, ForwardPickups, ScanStatus, UploadStatus],
        (sqlTxn, res) => {
          console.log(`category added successfully`);
        },
        error => {
          console.log("error on adding category " + error.message);
        },
      );
    });
  };

  const storeUser = async () => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(value));
    } 
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // removeUser();
    storeUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  {
    db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS Sync1', []);
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS Sync1(userId ID VARCHAR(30) PRIMARY KEY  ,consignorPickupsList INT(15), CustomerPickupsList VARCHAR(50))`,
        [],
        (sqlTxn, res) => {
          console.log("table created successfully");
        },
        error => {
          console.log("error on creating table " + error.message);
        },
      );
    });


    db.transaction(txn => {
      txn.executeSql(
        `INSERT OR REPLACE INTO Sync1 (userId ,consignorPickupsList , CustomerPickupsList) VALUES (?,?,?)`,
        [userId,data1,data2],
        (sqlTxn, res) => {
          console.log(`Data Added to local db successfully`);
          console.log(res);
          console.log(data1 + " " + data2);
        },
        error => {
          console.log("error on adding data " + error.message);
        },
      );
    });
    // viewDetails();
  };

  const viewDetails = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Sync1 where userId=?' ,
        [userId],
        (tx1, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            {temp.push(results.rows.item(i));
            console.log(results.rows.item(i).consignorPickupsList);
            setData1(results.rows.item(i).consignorPickupsList);
            setData2(results.rows.item(i).CustomerPickupsList);
            ToastAndroid.show("consignorPickupsList :" + results.rows.item(i).consignorPickupsList + "\n" + "CustomerPickupsList : " + results.rows.item(i).CustomerPickupsList , ToastAndroid.SHORT);
          }
          console.log(temp);
          // console.log(tx1);
        }
      );
    });
  };

useEffect(() => 
  {
  createTables();
   (async() => {
       await axios.get(getData)
       .then((res) => {
           setData(res.data.consignorPickupsList)
   }, (error) => {
       alert(error);
   }); 
   }) ();

   (async() => {
    await axios.get(shipmentData)
    .then((res) => {
        res.data.map(m => {
          axios.get(`https://bked.logistiex.com/SellerMainScreen/getSellerDetails/${m.consignorCode}`).then((d) => {
            d.data.totalPickups.map((val) => {
              addCategory(val.clientShipmentReferenceNumber, val.packagingId, val.packagingStatus,m.consignorCode,m.consignorContact, m.PRSNumber, m.ForwardPickups, 0, 0);
            })
          })
        })
}, (error) => {
    alert(error);
}); 
}) ();
  }
 ,[]);

  useEffect(() => {
    (async() => {
      await axios.get(getData)
      .then((res) => {
        setData1(res.data.consignorPickupsList);
        setData2(res.data.CustomerPickupsList);
        console.log(res.data.CustomerPickupsList);
        console.log(res.data.consignorPickupsList);
      }, 
      (error) => {
        Alert.alert(error);
      });
    })();
  }, []);

  const sync11 = () => {
    console.log('Sync Button Pressed');
    NetInfo.fetch()
    .then(state => {
      console.log("Connection type", state.type);
      console.log("Is connected :", state.isConnected + " " + state.isInternetReachable);
      if (state.isConnected && state.isInternetReachable){
        console.log("You are online!");
        ToastAndroid.show('You are Online!', ToastAndroid.SHORT);
        ToastAndroid.show('Adding Data to Local DB!', ToastAndroid.SHORT);
        createTables();
      } 
      else {
        console.log("You are offline!");
        ToastAndroid.show('You are Offline!', ToastAndroid.SHORT);
        console.log('Your Details from Local DB is');
        viewDetails();
      }
    });
  };


  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#004aad" alignItems="center">
        <Box bg="#fff" margin={10} paddingTop={10} paddingBottom={10} alignSelf="center" justifyContent="space-evenly" py="6" px="0" rounded="md" width={"90%"} maxWidth="100%">
          <TouchableOpacity onPress={()=>navigation.navigate('Dashboard')}>
            <View style={{backgroundColor: '#eeeeee', height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 20, borderRadius: 5}}>
              <Text style={{color: '#004aad', fontSize: 16, fontWeight: '500'}}>Customer Deliveries ({56}) </Text>
              <ArrowForwardIcon style={{color:"#004aad"}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('Dashboard')} style={{marginTop: 20}}>
            <View style={{backgroundColor: '#eeeeee', height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 20, borderRadius: 5}}>
              <Text style={{color: '#004aad', fontSize: 16, fontWeight: '500'}}>Customer Pickups ({56}) </Text>
              <ArrowForwardIcon style={{color:"#004aad"}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('Dashboard')} style={{marginTop: 20}}>
            <View style={{backgroundColor: '#eeeeee', height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 20, borderRadius: 5}}>
              <Text style={{color: '#004aad', fontSize: 16, fontWeight: '500'}}>Seller Deliveries ({56}) </Text>
              <ArrowForwardIcon style={{color:"#004aad"}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('NewSellerPickup',{count : data, userId : route.params.userId})} style={{marginTop: 20}}>
            <View style={{backgroundColor: '#eeeeee', height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 20, borderRadius: 5}}>
              <Text style={{color: '#004aad', fontSize: 16, fontWeight: '500'}}>Seller Pickups ({data1}) </Text>
              <ArrowForwardIcon style={{color:"#004aad"}} />
            </View>
          </TouchableOpacity>
          <Button onPress={()=>sync11()} style={{backgroundColor: '#004aad', marginHorizontal: 20, marginTop: 20,}} leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" />} > Sync</Button>
        </Box>
        <Center>
          <Image style={{ width: 200, height: 200 }} source={require('../assets/logo.png')} alt={"Logo Image"} />
        </Center>
      </Box>
    </NativeBaseProvider>
  );
};
