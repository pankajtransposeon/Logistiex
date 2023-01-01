import {ProgressBar} from '@react-native-community/progress-bar-android';
import {NativeBaseProvider, Box, Image, Center, Fab, Icon,} from 'native-base';
import {StyleSheet,View,ScrollView,ToastAndroid,Alert} from 'react-native';
import {DataTable, Button, Searchbar, Text, Card } from 'react-native-paper';
import NetInfo from "@react-native-community/netinfo";
import {openDatabase} from "react-native-sqlite-storage";
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  <NativeBaseProvider>
    <Box flex={1} bg="#fff"  width="auto" maxWidth="100%">
      <Searchbar
        placeholder="Search Seller Name"
        onChangeText={(e) => setKeyword(e)}
        value={keyword}
        style={{marginHorizontal: 15, marginTop: 10}}
      />
      <ScrollView style={styles.homepage} showsVerticalScrollIndicator={true} showsHorizontalScrollIndicator={false}>
        <Card>
          <DataTable>
            <DataTable.Header style={{height:'auto', backgroundColor: '#004aad', borderTopLeftRadius: 5, borderTopRightRadius: 5}} >
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Seller Name</Text></DataTable.Title>
              <DataTable.Title><Text style={{ textAlign: 'center', color:'white'}}>Forward Pickups</Text></DataTable.Title>
              <DataTable.Title><Text style={{ textAlign: 'center', color:'white'}}>Reverse Deliveries</Text></DataTable.Title>
            </DataTable.Header>
            {data && data.length > 0 ?
            data.filter(searched(keyword)).map((single, i) => (
              <DataTable.Row style={{height:'auto' ,backgroundColor:'#eeeeee', borderBottomWidth: 1}} onPress={() =>{navigation.navigate('NewSellerSelection',{
                paramKey : single.consignorCode,
                Forward : single.ForwardPickups,
                consignorAddress : single.consignorAddress,
                consignorName : single.consignorName,
                PRSNumber : single.PRSNumber,
                consignorCode : single.consignorCode,
                userId : route.params.userId,
                phone : single.consignorContact,
              })}}>
                <DataTable.Cell style={{flex: 1.7}}>{single.consignorName}</DataTable.Cell>
                <DataTable.Cell>{single.ForwardPickups}</DataTable.Cell>
                <DataTable.Cell>{single.ReverseDeliveries}</DataTable.Cell>
              </DataTable.Row>
            )) 
          :
            null
          }
          </DataTable>
        </Card>
      </ScrollView>
      <Center>
          <Image style={{ width:150, height:150}} source={require('../../assets/image.png')} alt={"Logo Image"} />
      </Center>
    </Box>
    <Fab onPress={()=>sync11()} position="absolute" size="sm" style={{backgroundColor: '#004aad'}} icon={<Icon color="white" as={<MaterialIcons name="sync" />} size="sm" />} />
    {isLoading ?
      <View style={[StyleSheet.absoluteFillObject, styles.container222]}>
        <Text>Loading Please Wait...</Text>
        <ProgressBar width={70}/>
      </View>
    :
      null
    }
    </NativeBaseProvider>
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
    margin:10
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
    width: '95%',
    borderWidth:2,
    borderColor:'white',
    borderRadius:1,
    marginLeft:10,
    marginRight:10,
},
bt1: {
    fontFamily: 'open sans',
    fontSize: 15,
    lineHeight: 0,
    marginTop:0,
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
