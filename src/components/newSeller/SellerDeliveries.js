import {
    ArrowForwardIcon,
    NativeBaseProvider,
    Box,
    Image,
    Center,
  } from 'native-base';
  import {StyleSheet, ScrollView} from 'react-native';
  import {DataTable, Searchbar, Text, Card} from 'react-native-paper';
  import {openDatabase} from 'react-native-sqlite-storage';
  import React, {useEffect, useState} from 'react';
  import {useNavigation} from '@react-navigation/native';
  import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  const db = openDatabase({name: 'rn_sqlite'});
  
  const NewSellerPickup = ({route}) => {
  
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [pending11,setPending] =useState([]);
    const [value,setValue] =useState([]);
    const [reverse,setReverse] =useState([]);
    const navigation = useNavigation();
  
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          loadDetails();
        });
        return unsubscribe;
      }, [navigation]);
  
    const loadDetails = () => { // setIsLoading(!isLoading);
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => { // ToastAndroid.show("Loading...", ToastAndroid.SHORT);
                let temp = [];
                console.log(results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
                setData(temp);
            });
        });
        
    };
    useEffect(() => {
        if (data.length > 0) {
          const counts = [];
          data.forEach((single) => {
            db.transaction((tx) => {
              tx.executeSql(
                'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? AND status IS NOT NULL',
                [single.consignorCode],
                (tx1, results) => {
                  counts.push(results.rows.length);
                  if (counts.length === data.length) {
                    setPending(counts);
                  }
                },
              );
            });
          });
        }
      }, [data, db]);
      useEffect(() => {
        if (data.length > 0) {
          const counts = [];
          data.forEach((single) => {
            db.transaction((tx) => {
              tx.executeSql(
                'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Pickup" AND consignorCode=?',
                [single.consignorCode],
                (tx1, results) => {
                  counts.push(results.rows.length);
                  if (counts.length === data.length) {
                    setValue(counts);
                  }
                },
              );
            });
          });
        }
      }, [data, db]);
      useEffect(() => {
        if (data.length > 0) {
          const counts = [];
          data.forEach((single) => {
            db.transaction((tx) => {
              tx.executeSql(
                'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=?',
                [single.consignorCode],
                (tx1, results) => {
                  counts.push(results.rows.length);
                  if (counts.length === data.length) {
                    setReverse(counts);
                  }
                },
              );
            });
          });
        }
      }, [data, db]);
      
    useEffect(() => {
        (async () => {
            loadDetails();
        })();
    }, []);
    const searched = (keyword1) => (c) => {
        let f = c.consignorName;
        return (f.includes(keyword1));
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
            <DataTable.Header style={{height:'auto', backgroundColor: '#004aad', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderWidth:2, borderColor:'white'}}  >
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Seller Name</Text></DataTable.Title>
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Forward Pickups</Text></DataTable.Title>
              <DataTable.Title style={{flex: 1.2,marginRight:-35}}><Text style={{ textAlign: 'center', color:'white'}}>Reverse Deliveries</Text></DataTable.Title>
            </DataTable.Header>
            {route.params.Trip !== 'Start Trip' && data && data.length > 0 && (Math.abs(route.params.Forward) + Math.abs(route.params.Reverse)) !== 0 && data.filter(searched(keyword)).map((single, i) => (
            (( pending11[i]!=reverse[i]) ?
            <DataTable.Row style={{ height: 'auto', backgroundColor: '#eeeeee', borderBottomWidth: 1, borderWidth: 2, borderColor: 'white',elevation: 8, }} key={single.consignorName} onPress={() => {
             navigation.navigate('SellerHandoverSelection', {
            paramKey: single.consignorCode,
            Forward: value[i],
            consignorAddress1: single.consignorAddress1,
            consignorAddress2: single.consignorAddress2,
            consignorCity: single.consignorCity,
            consignorPincode: single.consignorPincode,
            consignorLatitude: single.consignorLocation,
            consignorLongitude: single.consignorLongitude,
            contactPersonName: single.contactPersonName,
            consignorName: single.consignorName,
            PRSNumber: single.PRSNumber,
            consignorCode: single.consignorCode,
            userId: single.userId,
            phone: single.consignorContact,
            });
    }}>
      <DataTable.Cell style={{ flex: 1.7 }}><Text style={styles.fontvalue}>{single.consignorName}</Text></DataTable.Cell>
      <DataTable.Cell style={{ flex: 1, marginRight: 50 }}><Text style={styles.fontvalue}>{value[i]}</Text></DataTable.Cell>
      <DataTable.Cell style={{ flex: 1, marginRight: -70 }}><Text style={styles.fontvalue}>{pending11[i]}/{reverse[i]}</Text></DataTable.Cell>
    </DataTable.Row>
    :
    <DataTable.Row style={{ height: 'auto', backgroundColor: '#90ee90', borderBottomWidth: 1, borderWidth: 2, borderColor: 'white' }} key={single.consignorName} >
      <DataTable.Cell style={{ flex: 1.7 }}><Text style={styles.fontvalue}>{single.consignorName}</Text></DataTable.Cell>
      <DataTable.Cell style={{ flex: 1, marginRight: 50 }}><Text style={styles.fontvalue}>{value[i]}</Text></DataTable.Cell>
      <DataTable.Cell style={{ flex: 1, marginRight: -70 }}><Text style={styles.fontvalue}>{pending11[i]}/{reverse[i]}</Text></DataTable.Cell>
    </DataTable.Row>
  )
  ))}
        {route.params.Trip === 'Start Trip' && data && data.length > 0 && (Math.abs(route.params.Forward) + Math.abs(route.params.Reverse)) !== 0 && data.filter(searched(keyword)).map((single, i) => (
            ((pending11[i]!= reverse[i]) ?
            <DataTable.Row style={{ height: 'auto', backgroundColor: '#eeeeee', borderBottomWidth: 1, borderWidth: 2, borderColor: 'white' ,elevation: 8,}} key={single.consignorName} onPress={() => {
             navigation.navigate('MyTrip', {userId: route.params.userId});
    }}>
      <DataTable.Cell style={{ flex: 1.7 }}><Text style={styles.fontvalue}>{single.consignorName}</Text></DataTable.Cell>
      <DataTable.Cell style={{ flex: 1, marginRight: 50 }}><Text style={styles.fontvalue}>{value[i]}</Text></DataTable.Cell>
      <DataTable.Cell style={{ flex: 1, marginRight: -70 }}><Text style={styles.fontvalue}>{pending11[i]}/{reverse[i]}</Text></DataTable.Cell>
    </DataTable.Row>
    :
    <DataTable.Row style={{ height: 'auto', backgroundColor: '#90ee90', borderBottomWidth: 1, borderWidth: 2, borderColor: 'white' }} key={single.consignorName} >
      <DataTable.Cell style={{ flex: 1.7 }}><Text style={styles.fontvalue}>{single.consignorName}</Text></DataTable.Cell>
      <DataTable.Cell style={{ flex: 1, marginRight: 50 }}><Text style={styles.fontvalue}>{value[i]}</Text></DataTable.Cell>
      <DataTable.Cell style={{ flex: 1, marginRight: -60 }}><Text style={styles.fontvalue}>{pending11[i]}/{reverse[i]}</Text></DataTable.Cell>
    </DataTable.Row>
  )
  ))}
          </DataTable>
        </Card>
      </ScrollView>
      <Center>
          <Image style={{ width:150, height:150}} source={require('../../assets/image.png')} alt={'Logo Image'} />
      </Center>
    </Box>
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
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.2 )',
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
        margin: 10,
        // backgroundColor:"blue",
    },
    mainbox: {
        width: '98%',
        height: 40,
        backgroundColor: 'lightblue',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 5,
        shadowColor: '#000',
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
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    bt1: {
        fontFamily: 'open sans',
        fontSize: 15,
        lineHeight: 0,
        marginTop: 0,
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
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 0,
    },
  });