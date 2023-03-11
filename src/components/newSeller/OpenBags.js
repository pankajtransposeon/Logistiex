import {
  NativeBaseProvider,
  Box,
  Image,
  Center,
  Button,
  Modal,
  Input,
} from 'native-base';
import {StyleSheet, ScrollView, View} from 'react-native';
import {DataTable, Searchbar, Text, Card} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const db = openDatabase({name: 'rn_sqlite'});

const OpenBags = ({route}) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [showCloseBagModal, setShowCloseBagModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [consignorNames, setconsignorNames] = useState('');
  const [consignorCode, setconsignorCode] = useState('');
  const [NoShipment, setNoShipment] = useState(45);
  const [bagSeal, setBagSeal] = useState('');

  const loadDetails = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => {
        let temp = [];
        console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setData(temp);
        console.log(data[0].ShipmentListArray.split().length, 'data');
      });
    });
  };

  useEffect(() => {
    (async () => {
      loadDetails();
    })();
  }, []);

  const searched = keyword1 => c => {
    let f = c.consignorName;
    return f.includes(keyword1);
  };

  const CloseBagFunction = (consignorCode, consignorName) => {
    setShowCloseBagModal(true),
      setNoShipment(45),
      setconsignorCode(consignorCode),
      setconsignorNames(consignorName);
  };



  function CloseBag(){
    console.log(bagId);
    console.log(bagSeal);
    setBagId('');
    setBagIdNo(bagIdNo + 1);
  }

    const updateDetails2 = () => {
      console.log('scan 4545454');

      db.transaction((tx) => {
          tx.executeSql('UPDATE SellerMainScreenDetailsRTO SET  BagOpenClose="open" WHERE consignorCode=?', [barcode], (tx1, results) => {
              let temp = [];
              console.log('Results',results.rowsAffected);
              console.log(results);

              if (results.rowsAffected > 0) {
                console.log(barcode + 'accepted');
                ToastAndroid.show(barcode + ' Accepted',ToastAndroid.SHORT);

              } else {
                console.log(barcode + 'not accepted');
              }
              console.log(results.rows.length);
              for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
              }
              console.log('Data updated: \n ', JSON.stringify(temp, null, 4));
              // viewDetails2();
          });
      });
    };


  const getCategories = (data) => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM SellerMainScreenDetailsRTO WHERE consignorCode = ?',
        [data],
        (sqlTxn, res) => {
          console.log('categories retrieved successfully', res.rows.length);
          if (!res.rows.length){
            alert('You are scanning wrong product, please check.');
          } else {
              setBarcode(() => data);
              Vibration.vibrate(100);
              RNBeep.beep();
              updateDetails2();
              loadDetails(data);
          }
        },
        error => {
          console.log('error on getting categories ' + error.message);
        },
      );
    });
  };


  const onSuccess11 = e => {
    Vibration.vibrate(100);
    RNBeep.beep();
    console.log(e.data, 'sealID');
    getCategories(e.data);
    setBagSeal(e.data);
  };

  

  return (
    <NativeBaseProvider>
      <Modal isOpen={showCloseBagModal} onClose={() => setShowCloseBagModal(false)} size="lg">
        <Modal.Content maxWidth="350" >
          <Modal.CloseButton />
          <Modal.Header>Close Bag</Modal.Header>
          <Modal.Body>
          <QRCodeScanner
          onRead={onSuccess11}
          reactivate={true}
          // showMarker={true}
          reactivateTimeout={2000}
          flashMode={RNCamera.Constants.FlashMode.off}
          ref={(node) => { this.scanner = node; }}
          containerStyle={{ height:116,marginBottom:'55%' }}
          cameraStyle={{ height: 90, marginTop: 95,marginBottom:'15%', width: 289, alignSelf: 'center', justifyContent: 'center' }}
          // cameraProps={{ ratio:'1:2' }}
          // containerStyle={{width: '100%', alignSelf: 'center', backgroundColor: 'white'}}
          // cameraStyle={{width: '10%',alignSelf: 'center'}}
          // topContent={
          //   <View><Text>Scan Bag Seal</Text></View>
          // }
          // style={{
          //   // flex: 1,
          //   // width: '100%',
          // }}
        /> {'\n'}
        <Input placeholder="Enter Bag Seal" size="md" value={bagSeal} onChangeText={(text)=>setBagSeal(text)}  style={{

         width: 290,
      backgroundColor:'white',
      }} />
            {/* {'\n'}
            <Input placeholder="Enter Bag Seal" size="md" onChangeText={(text)=>setBagSeal(text)} /> */}
            <Button flex="1" mt={2} bg="#004aad" onPress={() => { CloseBag(); setShowCloseBagModal(false); }}>Submit</Button>
            <View style={{alignItems: 'center', marginTop: 15}}>
              <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '500', color: 'black'}}>Seller Code</Text>
                {
                    data && data.length ? (
                        <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{data[0].consignorCode}</Text>
                    ):null
                }
                {/* <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{sellerCode11}</Text> */}

              </View>
              <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>Seller Name</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{data[0].consignorName}</Text>
                  ):null
                }
              </View>
              <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 1, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>Number of Shipments</Text>
                {
                  data && data.length ? (
                    <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{data[0].ForwardPickups}</Text>
                  ):null
                }
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {/* <Modal
        isOpen={showCloseBagModal}
        onClose={() => setShowCloseBagModal(false)}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header />
          <Modal.Body>
            <Input
              placeholder="Enter Bag Seal"
              size="md"
              onChangeText={text => setBagSeal(text)}
            />
            <Button
              flex="1"
              mt={2}
              bg="#004aad"
              onPress={() => {
                setShowCloseBagModal(false),
                  navigation.navigate('PendingHandover');
              }}>
              Submit
            </Button>
            <View style={{alignItems: 'center', marginTop: 15}}>
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: 'lightgray',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  padding: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Seller Code
                </Text>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  {consignorCode}
                </Text>
              </View>
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: 'lightgray',
                  padding: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Seller Name
                </Text>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  {consignorNames}
                </Text>
              </View>
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: 'lightgray',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  padding: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Number of Shipments
                </Text>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  {NoShipment}
                </Text>
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal> */}

      <Box flex={1} bg="#fff" width="auto" maxWidth="100%">
        <ScrollView
          style={styles.homepage}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}>
          <Card>
            <DataTable>
              <DataTable.Header
                style={{
                  height: 'auto',
                  backgroundColor: '#004aad',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}>
                <DataTable.Title style={{flex: 1.2}}>
                  <Text style={{textAlign: 'center', color: 'white'}}>
                    Seller Name
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={{flex: 1.2}}>
                  <Text style={{textAlign: 'center', color: 'white'}}>
                    No. of Shipment
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={{flex: 0.8, paddingLeft: 10}}>
                  <Text style={{textAlign: 'center', color: 'white'}}>
                    Bag Status
                  </Text>
                </DataTable.Title>
              </DataTable.Header>

             
            </DataTable>
          </Card>
        </ScrollView>
        <Center>
          <Image
            style={{width: 150, height: 150}}
            source={require('../../assets/image.png')}
            alt={'Logo Image'}
          />
        </Center>
      </Box>
    </NativeBaseProvider>
  );
};
export default OpenBags;
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
