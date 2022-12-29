/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from 'react-native-paper';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import {ArrowForwardIcon, NativeBaseProvider, Box, Image, Center,Input,HStack,SearchIcon,} from 'native-base';
import {StyleSheet,Text,TouchableOpacity,View,ScrollView,TextInput,getPick,ActivityIndicator,ToastAndroid,Alert} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {openDatabase} from "react-native-sqlite-storage";
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
const db = openDatabase({name: "rn_sqlite"});

const NewSellerPickup = ({route}) => {

  const [data,setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

const getData = `https://bked.logistiex.com/SellerMainScreen/getSellerList/${route.params.userId}`;
const userId = route.params.userId;
const navigation = useNavigation();
const toggleLoading = () => {
    setIsLoading(!isLoading);
    (async () => {
        await axios.get(getData).then((res) => 
        {
            setData(res.data);
            console.log("Size of data : " + res.data.length);
            for (let i = 0; i < res.data.length; i++) 
            {
                console.log(res.data[i].consignorCode);
                let m21 = JSON.stringify(res.data[i].consignorAddress, null, 4);
                db.transaction(txn => {
                    txn.executeSql(`INSERT OR REPLACE INTO SyncSellerPickUp( consignorCode ,userId ,consignorName , consignorAddress,
                    consignorLocation ,consignorContact ,ReverseDeliveries ,PRSNumber ,ForwardPickups) VALUES (?,?,?,?,?,?,?,?,?)`, [
                        res.data[i].consignorCode,
                        userId,
                        res.data[i].consignorName,
                        m21,
                        res.data[i].consignorLocation,
                        res.data[i].consignorContact,
                        res.data[i].ReverseDeliveries,
                        res.data[i].PRSNumber,
                        res.data[i].ForwardPickups,
                    ], (sqlTxn, res) => {
                        console.log(`\n Data Added to local db successfully`);
                        console.log(res);
                    }, error => {
                        console.log("error on adding data " + error.message);
                    },);
                });
            }
            viewDetails();
        }, (error) => {
            Alert.alert(error);
        });
    })();

// setIsLoading ? navigation.navigate('loading1') : null;
setTimeout(() => 
{
    setIsLoading(false);
    navigation.navigate('NewSellerPickup');
}, 4000);};const sync11 = () => {
NetInfo.fetch().then(state => {
    if (state.isConnected && state.isInternetReachable) {
        console.log("You are online!");
        ToastAndroid.show('You are Online!', ToastAndroid.SHORT);
        createTables();
        //ToastAndroid.show('Adding Data to Local DB!', ToastAndroid.SHORT);
        toggleLoading();
    } else {
        console.log("You are offline!");
        ToastAndroid.show('You are Offline!', ToastAndroid.SHORT);
        console.log('Your Details from Local DB is');
        viewDetails();
    }
});
};
const createTables = () => {
    db.transaction(txn => {
        txn.executeSql('DROP TABLE IF EXISTS SyncSellerPickUp', []);
        txn.executeSql(`CREATE TABLE IF NOT EXISTS SyncSellerPickUp( consignorCode ID VARCHAR(200) PRIMARY KEY ,userId VARCHAR(100), consignorName VARCHAR(200),consignorAddress VARCHAR(500),
			consignorLocation VARCHAR(200),consignorContact VARCHAR(200),ReverseDeliveries INT(20) ,PRSNumber VARCHAR(200),ForwardPickups INT(20))`, [], (sqlTxn, res) => {
            console.log("table created successfully");
        }, error => {
            console.log("error on creating table " + error.message);
        },);
    });
};

const viewDetails = () => {
    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => {
            let temp = [];
            console.log(results.rows.length);
            for (let i = 0; i < results.rows.length; ++ i) {
                temp.push(results.rows.item(i));
                console.log(results.rows.item(i).consignorName);
                var address121 = results.rows.item(i).consignorAddress;
                var address_json = JSON.parse(address121);
                // console.log(typeof (address_json));
                console.log("Address from local db : " + address_json.consignorAddress1 + " " + address_json.consignorAddress2);
                ToastAndroid.show('consignorName:' + results.rows.item(i).consignorName + "\n" + 'PRSNumber : ' + results.rows.item(i).PRSNumber, ToastAndroid.SHORT);
            }
            console.log("Data from Local Database : \n ", JSON.stringify(temp, null, 4));
        });
    });
};

useEffect(() => {
    (async () => {
        await axios.get(getData).then((res) => {
            setData(res.data);
        }, (error) => {
            Alert.alert(error);
        });
    })();
}, []);
const searched = (keyword) => (c) => {
    let f = c.consignorName;
    return (f.includes(keyword));
};

return (
    <>
    <NativeBaseProvider>
        <Box flex={1} bg="#fff"  width="auto" maxWidth="100%">
        <TouchableOpacity>
            <View style={styles.normal}>
                <Text style={styles.text}>Seller Pickups ( {route.params.count} ) </Text>
            </View>
        </TouchableOpacity>
        <HStack  marginTop={2}>
            <View style={styles.searchbar}>
              {/* <SearchIcon size="5" mt="0.5" color="#004aad" /> */}
              <Input type="search" placeholder=" Search by Seller Name " SearchIcon value={keyword} className="form-control mb-4 container pt-4" onChangeText={(e) => setKeyword(e)} />
            </View>
        </HStack>
        <ScrollView style={styles.homepage} showsVerticalScrollIndicator={true} showsHorizontalScrollIndicator={false}>
            <DataTable.Header style={styles.tableHeader}>
		        <DataTable.Title style={{backgroundColor:'#004aad',Color:'white', flex:1}}><Text style={styles.textbox}>Seller Name</Text></DataTable.Title>
		        <DataTable.Title  style={{backgroundColor:'#004aad',Color:'white',flex:1}} ><Text style={styles.textbox}>Forward Pickups</Text></DataTable.Title>
		        <DataTable.Title style={{backgroundColor:'#004aad',Color:'white',flex:1}} ><Text style={styles.textbox}>Reverse Deliveries</Text></DataTable.Title>
            </DataTable.Header>
        {data && data.length > 0 ? (
        data.filter(searched(keyword)).map((single, i) => (
        <TouchableOpacity key={i}  style={styles.mainbox} onPress={()=> navigation.navigate('NewSellerSelection',{
        paramKey : single.consignorCode,
        Forward : single.ForwardPickups,
        consignorAddress : single.consignorAddress,
        consignorName : single.consignorName,
        PRSNumber : single.PRSNumber,
        consignorCode : single.consignorCode,
        userId : route.params.userId,
        phone : single.consignorContact,
        })}>
        <View style={styles.innerdown}>
            <DataTable style={styles.container112}>
	        <DataTable.Row>
		        <DataTable.Cell style={{flex: 2}}> <Text style={styles.fontvalue} >{single.consignorName}</Text></DataTable.Cell>
		        <DataTable.Cell style={{flex: 1}}><Text style={styles.fontvalue} >{single.ForwardPickups}</Text></DataTable.Cell>
		        <DataTable.Cell style={{flex: 1}}><Text style={styles.fontvalue} >{single.ReverseDeliveries}</Text></DataTable.Cell>
                <ArrowForwardIcon style={{color:"#004aad",marginTop:15}} />
	        </DataTable.Row>
	        </DataTable>
        </View>
        </TouchableOpacity>
        ))
    ) : ( <Text />
    )}
    </ScrollView>
        <TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.bt1}>
            <Text style={styles.btnText}>Language</Text>
          </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={sync11}>
        <View style={[styles.container, styles.horizontal]}>
          <View style={styles.bt2}>
          {isLoading && <ActivityIndicator size="small" color="#00ff00" />}
          <Text style={styles.btnText}>Sync</Text>
        </View>
        </View>
        </TouchableOpacity>
        </Box>
        <Center>
            <Image style={{ width:150, height:150 }} source={require('../../assets/image.png')} alt={"Logo Image"} />
        </Center>
    </NativeBaseProvider>
     {isLoading ? (
        <View style={[StyleSheet.absoluteFillObject, styles.container222]}>
           <Text>Loading Please Wait...</Text>
           <ProgressBar width={70}/>
       </View>
       ) : (
           <Text></Text>
       )}
   </>
  );
};
export default NewSellerPickup;
export const styles = StyleSheet.create({

container112: { 
    justifyContent: 'center',
},
tableHeader: {
    backgroundColor: '#004aad',
    alignItems: 'flex-start',
    fontFamily: 'open sans',
    fontSize: 15,
    color: 'white',
    margin: 1,
    },
    container222: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1,
        backgroundColor:'rgba(0,0,0,0.2 )',
    },
normal: {
    fontFamily: 'open sans',
    fontWeight: 'normal',
    color: '#eee',
    marginTop: 27,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#eee',
    width: 'auto',
    borderRadius: 0,
    alignContent: 'space-between',
},
text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    justifyContent: 'space-between',
    paddingLeft: 20,
},
main: {
    backgroundColor: '#004aad',
    width: 'auto',
    height: 'auto',
    margin: 1,
},
textbox: {
    alignItems: 'flex-start',
    fontFamily: 'open sans',
    fontSize: 13,
    color: '#fff',
},
homepage: { 
      // backgroundColor:"blue",
},
mainbox: {
    width: '98%',
    height: 40,
    backgroundColor: 'lightblue',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 1,
},
innerup: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'blue',
},
innerdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
fontvalue: {
   fontWeight: '300',
    flex: 1,
    fontFamily: 'open sans',
    justifyContent: 'center',
},
fontvalue1: {
    fontWeight: '700',
    marginTop: 10,
    marginLeft: 100,
    marginRight: -10,
},
searchbar: {
    width: '100%',
},
bt1: {
    fontFamily: 'open sans',
    fontSize: 15,
    lineHeight: 0,
    marginTop:-45,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#004aad',
    width: 110,
    borderRadius: 10,
    paddingLeft: 0,
    marginLeft: 15,
    marginVertical: 0,
},
bt2: {
    fontFamily: 'open sans',
    fontSize: 15,
    lineHeight: 0,
    marginTop: -45,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#004aad',
    width: 110,
    borderRadius: 10,
    paddingLeft: 0,
    marginLeft: 235,
    marginVertical: 0,
},
btnText: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 15,
},
container: {
    flex: 1,
    justifyContent: "center",
},
horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 0,
},
});

