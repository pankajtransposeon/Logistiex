import React, { useEffect, useState,Alert } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Text,StyleSheet, TouchableOpacity, View, Platform,ToastAndroid } from 'react-native';
import axios from 'axios';
import { ArrowForwardIcon, NativeBaseProvider, Box} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from "react-native-sqlite-storage";
const db = openDatabase({name: "rn_sqlite"});

const Main = ({route}) => {

  const getData = `https://bked.logistiex.com/SellerMainScreen/getMSD/${route.params.userId}`;
  const shipmentData = `https://bked.logistiex.com/SellerMainScreen/getSellerList/${route.params.userId}`;
  const userId = route.params.userId;

  const [data, setData]   = useState(0);
  const [data1, setData1] = useState(0);
  const [data2, setData2] = useState("");
  const [count, setcount] = useState(0);
  const [categories, setCategories] = useState([]);

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
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
//   removeUser();
  storeUser();
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
      //   console.log(tx1);
      }
    );
  });
};


const navigation = useNavigation();

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
              addCategory(val.clientShipmentReferenceNumber, val.packagingId, val.packagingStatus,m.consignorCode,m.consignorContact, m.PRSNumber, m.ForwardPickups, 0, 0)
            })
          })
        })

}, (error) => {
    alert(error);
}); 
}) ();
  }
 ,[]);

  useEffect(() =>
  {
   (async() => {
       await axios.get(getData)
       .then((res) => {
           setData1(res.data.consignorPickupsList);
           setData2(res.data.CustomerPickupsList);
           console.log(res.data.CustomerPickupsList);
           console.log(res.data.consignorPickupsList);
          //  createTables();
   }, (error) => {
       Alert.alert(error);
   });
  })();
  }
//  eslint-disable-next-line react-hooks/exhaustive-deps
 ,[]);

 const sync11 = () => {
  console.log('Sync Button Pressed');

  NetInfo.fetch().then(state => {
    console.log("Connection type", state.type);
    console.log("Is connected :", state.isConnected + " " + state.isInternetReachable);
    if (state.isConnected && state.isInternetReachable){
      console.log("You are online!");
      ToastAndroid.show('You are Online!', ToastAndroid.SHORT);
      //ToastAndroid.show('Adding Data to Local DB!', ToastAndroid.SHORT);
      createTables();

    } else {
      console.log("You are offline!");
      ToastAndroid.show('You are Offline!');
          console.log('Your Details from Local DB is');
          viewDetails();
    }
  });

 };


  return (
    <NativeBaseProvider>
     <Box flex={1} bg="#004aad" alignItems="center">
     	<Box bg="#fff" margin={10} paddingTop={10}  paddingBottom={10} alignSelf="center" justifyContent="space-evenly" py="8" px="0" rounded="md" width={360} maxWidth="100%">
      <TouchableOpacity onPress={()=>navigation.navigate('Dashboard')}>
      <View style={styles.normal}>
        <Text style={styles.text}>Customer Deliveries </Text>
        <ArrowForwardIcon style={{color:"#004aad",marginLeft:260,marginTop:-20}} />
      </View>
      </TouchableOpacity>

      <TouchableOpacity  >
      <View style={styles.normal}>
        <Text style={styles.text}>Customer Pickups </Text>
        <ArrowForwardIcon style={{color:"#004aad",marginLeft:260,marginTop:-20}} />
      </View>
      </TouchableOpacity>

      <TouchableOpacity >
      <View style={styles.normal}>
        <Text style={styles.text}>Seller Deliveries </Text>
        <ArrowForwardIcon style={{color:"#004aad",marginLeft:260,marginTop:-20}} />
      </View>
      </TouchableOpacity>

      <TouchableOpacity  onPress={()=>navigation.navigate('NewSellerPickup',{
        count : data,
        userId : route.params.userId
      })}>
      <View style={styles.normal}>
        <Text style={styles.text}>Seller Pickups {data1} </Text>
        <ArrowForwardIcon style={{color:"#004aad",marginLeft:260,marginTop:-20}} />
      </View>
      </TouchableOpacity>


      <TouchableOpacity>
      	<View style={styles.container}>
      		<View style={styles.bt1}>
      			<Text style={styles.text1} >Language</Text>
      		</View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>sync11()}>
        <View style={styles.container}>

      		<View style={styles.bt2}>
      			<Text style={styles.text1}>Sync</Text>
      		</View>

        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
        <View style={styles.container}>
      		<View style={styles.bt3}>
      			<Text style={styles.text1}>Logout</Text>
      		</View>
      	</View>
    </TouchableOpacity>


 	 </Box>
     </Box>
  </NativeBaseProvider>
  );
};



const styles = StyleSheet.create({

  main:{
    backgroundColor:'#004aad',
   },
  normal:{
        marginTop:27,
        marginBottom:-5,
        marginLeft:30,
        marginRight:30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#eee',
        width:'auto',
        borderRadius:0,
    },

    text:{
      fontFamily:'open sans',
      fontWeight:'normal',
      fontSize:18,
      paddingLeft:30,
      color:'#000',
      justifyContent: 'center',

    },

    text1:{
      alignSelf: 'center',
      color:'#fff',
      fontWeight:'bold',
      fontSize:18,

    },

    bt1:{
      fontFamily:'open sans',
      fontSize:15,
      lineHeight:10,
      marginTop:27,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#004aad',
      width:110,
      borderRadius:10,
      paddingLeft:0,
      marginLeft:10,


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
      marginLeft:130,


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
      width:110,
      borderRadius:10,
      paddingLeft:0,
      marginLeft:240,


    },


});

export default Main;
