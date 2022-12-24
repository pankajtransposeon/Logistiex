import { Container,ArrowForwardIcon, NativeBaseProvider, 
    Box, 
    Image,
    Center } from 'native-base';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import{StyleSheet,Text,TouchableOpacity,View, ScrollView, TextInput,getPick} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from "react-native-sqlite-storage";
import { NetInfo } from "react-native";
import NetInfo from "@react-native-community/netinfo";

NetInfo.isConnected.addEventListener(
  "connectionChange",
  hasInternetConnection =>
    console.debug("hasInternetConnection:", hasInternetConnection)
);
const signalTypeRange = {
    RSSI: [-113, -51, "dBm"],
    RSSNR: [-20, +30, "dB"],
    RSRQ: [-34, 3, "dB"],
    RSRP: [-140, -43, "dBm"],
    };

let telephonyManager = application.android.context.getSystemService(android.content.Context.TELEPHONY_SERVICE);
let cellinfogsm = telephonyManager.getAllCellInfo().get(0);
let cellSignalStrengthGsm = cellinfogsm.getCellSignalStrength();
cellSignalStrengthGsm.getDbm();

const [isConnected, setIsConnected] = useState(false);

const getNetworkStatus = async () => {
    const network = await Network.getNetworkStateAsync();
    console.log(network.isConnected); //true or false
    setIsConnected(network.isConnected);
}

useEffect(() => {  
     //call the method
     getNetworkStatus();
}, []);

if(isConnected == true){
    console.log("Connected!");
}else{
    console.log("Not connected");
}
const Syn = ({route}) => {
    const DriverName = 'https://bked.logistiex.com/ADupdatePrams/getUPFR';
    const [DriverData, setDriverData] = useState([]);
    const [DropDownValue, setDropDownValue] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude , setLongitude] = useState(0);
  
    console.log(latitude, 'yutjk', longitude);
    console.log(route.params.barcode, route.params.consignorCode, route.params.PRSNumber)


    const shipmentData = "https://bked.logistiex.com/SellerMainScreen/getSellerDetails/MOKA209401";

  const[data, setData] = useState(0);
  const [count, setcount] = useState(0);
  // const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
 
const value = {
  Accepted: 0,
  Rejected: 0
};

const createTables = () => {
  db.transaction(txn => {
    txn.executeSql('DROP TABLE IF EXISTS categories', []);
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT,clientShipmentReferenceNumber VARCHAR(50), packagingId VARCHAR(50), packagingStatus VARCHAR(50))`,
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

const addCategory = (clientShipmentReferenceNumber, packagingId, packagingStatus) => {
    console.log(clientShipmentReferenceNumber, packagingId, packagingStatus);
  if (!clientShipmentReferenceNumber && !packagingId && !packagingStatus) {
    alert("Enter category");
    return false;
  }

  db.transaction(txn => {
    txn.executeSql(
      `INSERT INTO categories (clientShipmentReferenceNumber, packagingId, packagingStatus) VALUES (?,?,?)`,
      [clientShipmentReferenceNumber, packagingId, packagingStatus],
      (sqlTxn, res) => {
        console.log(`${clientShipmentReferenceNumber, packagingId} category added successfully`);
      },
      error => {
        console.log("error on adding category " + error.message);
      },
    );
  });
};


const getCategories = () => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT * FROM categories ORDER BY id DESC`,
      [],
      (sqlTxn, res) => {
        console.log("categories retrieved successfully");
        let len = res.rows.length;

        if (len > 0) {
          let results = [];
          for (let i = 0; i < len; i++) {
            let item = res.rows.item(i);
            results.push({ id: item.id, name: item.name });
          }

          setCategories(results);
        }
      },
      error => {
        console.log("error on getting categories " + error.message);
      },
    );
  });
};


// const removeUser = async () => {
//   try {
//     await AsyncStorage.removeItem("user");
//   } catch (error) {
//     console.log(error);
//   }
// };

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

  
  let r = [];
  // r = data;

  const navigation = useNavigation();

  useEffect(() => 
  {
   (async() => {
       await axios.get(getData)
       .then((res) => {
           setData(res.data.consignorPickupsList)
   }, (error) => {
       alert(error);
   }); 
   }) ();
  }
 ,[]);

 useEffect(() => 
 {
  (async() => {
     createTables();
      await axios.get(shipmentData)
      .then((res) => {
          if(res.data && res.data.totalPickups){
           r = [...res.data.totalPickups]
           for(var i=0; i<r.length; i++){
            addCategory(r[i].clientShipmentReferenceNumber, r[i].packagingId, r[i].packagingStatus)
           }
         }
  }, (error) => {
      alert(error);
  }); 
  }) ();
 }
,[]);
  
    const current_location = () => {
  
      return GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
      })
      .then(latestLocation => {
          console.log('latest location '+JSON.stringify(latestLocation))
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
              if(status)
                  console.log('Location enabled');
          }).catch(err=>{
          })
          return false;
      })
  };
  
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
              if(status)
                  console.log('Location enabled');
          }).catch(err=>{
          })
          return false;
      })
  };
  
    current_location();
  }, []);
  
    const datadekho = async() => {
        await fetch(DriverName)
        .then((response) => response.json()) 
        .then((json) => {
          setDriverData(json);
          // console.log(json);
        })
        .catch((error) => alert(error)) 
      }
  
  
      const ContinueHandle = () => {
        const getUser = async () => {
          try {
            const savedUser = await AsyncStorage.getItem("user");
            const currentUser = JSON.parse(savedUser);
            await AsyncStorage.setItem("user", JSON.stringify({
              Accepted : 1 - currentUser.Accepted,
              Rejected : 1 + currentUser.Rejected
            }));
            console.log(currentUser);
          } catch (error) {
            console.log(error);
          }
        };
        getUser();
      }
  
      const submitForm = () => {
        axios.post('https://bked.logistiex.com/SellerMainScreen/postSPS', {
          clientShipmentReferenceNumber : route.params.barcode,
          feUserID: "HADWFE01",
          isAccepted : "false",
          rejectionReason : DropDownValue,
          consignorCode : route.params.consignorCode,
          pickupTime : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
          latitude : latitude,
          longitude : longitude,
          packagingId : "PL00000026",
          packageingStatus : 1,
          PRSNumber : route.params.PRSNumber
      })
          .then(function (response) {
              console.log(response.data, "hello");
              ContinueHandle();
              navigation.navigate('ShipmentBarcode');
          })
          .catch(function (error) {
              console.log(error);
          });
      }
      
      useEffect(() => {
          datadekho();   
      }, []);
      
    return (
        <NativeBaseProvider>
  
        <Box flex={1} bg="#fff">
  
  
        <TouchableOpacity>
         <View style={styles.normal}>
             <Text style={styles.text}>Reject Reason Code </Text>
         </View>
        </TouchableOpacity>
        
        <TouchableOpacity >
          <View style={styles.bt3}>
  
  
          <Picker
        selectedValue={DropDownValue}
        onValueChange={(value, index) => setDropDownValue(value)}
        mode="dropdown" // Android only
        style={styles.picker}
      >
        <Picker.Item label="Please select " value="Unknown" />
       
        {
          DriverData.map((d) => {
            return(
              <Picker.Item value={d.pickupFailureReasonGroupName} label={d.pickupFailureReasonName} key={d.pickupFailureReasonUserID}/>
            )
          })
        }
      </Picker>
  
  
  
          </View>
        </TouchableOpacity >
     
    
         <TouchableOpacity onPress={() => submitForm()}>
        <View style={styles.container}>
          <View style={styles.btn}>
            <Text style={styles.textbtn}>Sync</Text>
          </View>
        </View>
    </TouchableOpacity>
    </Box>
  </NativeBaseProvider>
    );
  };
  
  export default Syn;
  
  //Styles CSS
  
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
        borderRadius:0
    },
  
    text:{
      color:'#000',
      fontWeight:'bold',
      fontSize:18,
      textAlign:'center'
  
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
        borderRadius:20
    },
    textbox1:{
        color:'#fff',
        fontWeight:'bold',
        fontSize:18,
        width:'auto',
        flexDirection: "column",
        textAlign:'center'
    },
  
    textbtn:{
        alignSelf: 'center',
        color:'#fff',
        fontWeight:'bold',
        fontSize:18
  
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
        marginLeft:150
  
  
      },
      bt3: {
        fontFamily: 'open sans',
        color: '#000',
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 10,
        marginTop: 0,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
        width: 'auto',
        borderRadius: 10,
        paddingLeft: 0,
        marginLeft: 0,
        width:'45%'
    
      
      }
  
    });
