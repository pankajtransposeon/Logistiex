import { Container, NativeBaseProvider, Image, Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import{StyleSheet,Text,TouchableOpacity,View, ScrollView, TextInput,getPick, Alert, Vibration} from 'react-native';
import { Button, Center,Input, Modal } from "native-base";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { openDatabase } from "react-native-sqlite-storage";
import { background } from 'styled-system';
import NetInfo from "@react-native-community/netinfo";

const db = openDatabase({
  name: "rn_sqlite",
});


const ShipmentBarcode = ({route}) => {
    const [barcodeValue,setBarcodeValue] = useState("");
    const [packageValue,setpackageValue] = useState("");
    const [otp,setOtp] = useState('');
    const [flag, setflag] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [pending, setPending] = useState(0)
    const [expected, setExpected] = useState(0)
    const [newaccepted, setnewAccepted] = useState(0)
    const [newrejected, setnewRejected] = useState(0);  
    const [valuedekho, setvaluedekho] = useState('tanmay');
    const [barcode, setBarcode] = useState("");
    const [len, setLen] = useState(0);
    const [data, setData] = useState();
    
    const getCategories = (data) => {	
      db.transaction(txn => {	
        txn.executeSql(	
          `SELECT * FROM categories WHERE clientShipmentReferenceNumber = ? AND ScanStatus = ? `,	
          [data, 0],	
          (sqlTxn, res) => {	
            console.log("categories retrieved successfully", res.rows.length);	
            setLen(res.rows.length);	
            if(!res.rows.length){
              alert('You are scanning wrong product, please check.');	
            }
          },	
          error => {	
            console.log("error on getting categories " + error.message);	
          },	
        );	
      });	
    };

    const updateCategories = (data) => {	
      db.transaction((tx) => {	
        tx.executeSql(	
          'UPDATE categories set ScanStatus=? where clientShipmentReferenceNumber=?',	
          [1, data],	
          (tx, results) => {	
            console.log('Results', results.rowsAffected);	
          }	
        );	
      });	
    }
    
    const updateCategories1 = (data) => {	
      db.transaction((tx) => {	
        tx.executeSql(	
          'UPDATE categories set ScanStatus=?, UploadStatus=? where clientShipmentReferenceNumber=?',	
          [1, 1, data],	
          (tx, results) => {	
            console.log('Results', results.rowsAffected);	
          }	
        );	
      });	
    }	
    const onSuccess = e => {	
      console.log(e.data, 'barcode');	
      getCategories(e.data);	
      setBarcode(e.data);	
    }

    useEffect(() => {	
      if (len) {	
        ContinueHandle();	
        Vibration.vibrate(100);	
        setLen(false);	
        updateCategories(barcode);	
      } 
    }, [len]);
  

    const navigation = useNavigation();
    const [count, setcount] = useState(0);

    const ContinueHandle = () => {	
      const getUser = async () => {	
        try {	
          const savedUser = await AsyncStorage.getItem("user");	
          const currentUser = JSON.parse(savedUser);	
          await AsyncStorage.setItem("user", JSON.stringify({	
            Accepted: currentUser.Accepted + 1,	
            Rejected: currentUser.Rejected	
          }));	
          setnewAccepted(1 + currentUser.Accepted);	
          setnewRejected(currentUser.Rejected);	
        } catch (error) {	
          console.log(error);	
        }	
      };	
      getUser();	
    }
    
    useEffect(() => {	
      async function userdata() {	
        const savedUser = await AsyncStorage.getItem("user");	
        const currentUser = JSON.parse(savedUser);	
        setnewAccepted(currentUser.Accepted);	
        setnewRejected(currentUser.Rejected);	
      }	
      userdata();	
    }, [newaccepted, newrejected]);

    const handleSync = () => {	
      const unsubscribe = NetInfo.addEventListener(state => {	
        if (!state.isConnected) {	
          alert('check net connection');	
          return;	
        }	
        db.transaction((tx) => {	
          tx.executeSql(	
            'SELECT * FROM categories where ScanStatus = ? AND UploadStatus = ?',	
            [1, 0],	
            (tx, results) => {	
              var len = results.rows.length;	
              if (len > 0) {	
                let res = results.rows.item(0);	
                console.log(res, 'tanmay')	
                axios.post('https://bked.logistiex.com/SellerMainScreen/postSPS', {	
                  clientShipmentReferenceNumber: res.clientShipmentReferenceNumber,	
                  feUserID: route.params.userId,	
                  isAccepted: 'false',	
                  rejectionReason: 'null',	
                  consignorCode: res.consignorCode,	
                  pickupTime: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),	
                  latitude: 0,	
                  longitude: 0,	
                  packagingId: 'ss',	
                  packageingStatus: 1,	
                  PRSNumber: res.PRSNumber	
                })	
                  .then(function (response) {	
                    console.log(response.data, "hello");	
                    updateCategories1(res.clientShipmentReferenceNumber);	
                    alert('Data send on Server');	
                  })	
                  .catch(function (error) {	
                    console.log(error);	
                  });	
              } else {	
                alert('No data found');	
              }	
            }	
          );	
        });	
      });	
      // Unsubscribe	
      unsubscribe();	
    }
  
    return (
    
     <NativeBaseProvider>
     <Box flex={1} bg="#fff"  alignSelf="center" justifyContent='space-evenly' py="8" px="0" rounded="md" width='95%' maxWidth="100%">
     <Container style={styles.containter}>
     {/* <TouchableOpacity>
              <View style={styles.normal} >
                 <Text style={styles.text}>Scan Shipment Barcode</Text>
              </View>
    </TouchableOpacity> */}
   

     <ScrollView  style={styles.homepage}  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={{height:'auto', width:'auto'}} >
      <QRCodeScanner
    onRead={onSuccess}
    reactivate={true}
    reactivateTimeout={10000}
    flashMode={RNCamera.Constants.FlashMode.off}
    cameraProps={{ ratio: '1:1' }}
    // ratio={'3:3'}
  />
    </View>
    <View style={[styles.normal, {
        marginTop:10,
        marginBottom:10
      }]}>
        <Text style={styles.text}>shipment ID ----  {barcode}</Text>

    </View>

      
    {/* </TouchableOpacity> */}

    {/* <TouchableOpacity onPress={() => {
       setvaluedekho('package');
       navigation.navigate('NewBarcode');
    }}> */}
      {/* <View style={[styles.normal, {
        marginTop:10,
        marginBottom:40
      }]}>
        <Text style={styles.text}>package ID   ----  {packageValue}</Text>

      </View> */}
    {/* </TouchableOpacity> */}

    


      <TouchableOpacity onPress={()=>navigation.navigate('reject',{
         barcode : barcode,	
         PRSNumber : route.params.PRSNumber,	
         consignorCode : route.params.consignorCode,
         userId : route.params.userId,
         packagingId : route.params.packagingId
      })}>
              <View style={styles.btn} >
                 <Text style={styles.btntext}>Reject Shipment</Text>
              </View>
    </TouchableOpacity>
      
      <View style={styles.mainbox}>
             <View style={styles.smallbox}>
                <Text style={styles.text1}>Expected </Text>
                <Text style={styles.text1}>{route.params.Forward}</Text>
              </View>
              <View style={styles.smallbox}>
                <Text style={styles.text2}>Accepted</Text>
                <Text style={styles.text2}>{ newaccepted }</Text>
              </View>
              <View style={styles.smallbox}>
                <Text style={styles.text3}>Rejected</Text>
                <Text style={styles.text3}>{ newrejected }</Text>
              </View>
              <View style={styles.smallbox}>
                <Text style={styles.text3}>Not Handed Over</Text>
                <Text style={styles.text3}>{0}</Text>
              </View>
            </View>


            <TouchableOpacity onPress={() => handleSync()}>
      <View style={styles.Container1}>
        <View style={styles.bt1}>
          <Text style={styles.btnText}>Sync</Text>
        </View>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>navigation.navigate('POD',{
      Forward : route.params.Forward,
      accepted : newaccepted,
      rejected : newrejected,
      phone : route.params.phone,
      userId : route.params.userId,
    })}>  
      <View style={styles.Container1}>
    
        <View style={styles.bt2}>
          <Text style={styles.btnText}>Continue</Text>
        </View>

      </View>
    </TouchableOpacity>	

            {/* <TouchableOpacity>
      	
      		<View style={styles.bt1}>
                   <FontAwesomeIcon icon={faQrcode } color="black" size={25} style={{marginLeft:8,marginTop:8}} />
      			<Text style={styles.text1}>Scan</Text>
      		</View>
          
    </TouchableOpacity> */}
    {/* <TouchableOpacity  > 
            <View style={styles.bt2}>
      			<Text style={styles.text1}>Open Bag</Text>
      		</View>
          disabled={!barcodeValue && !packageValue} 
    </TouchableOpacity>
    <TouchableOpacity onPress={() => ContinueHandle()} > 
            <View style={styles.bt3}>
      			<Text style={styles.text1}>Continue</Text>
      		</View>
            
    </TouchableOpacity> */}
            
        </ScrollView>
           {/* content end */}

     
      {/* save button */}
      <View style={styles.iconbar}>
 
        {/* <Button  startIcon={<FontAwesomeIcon icon={faCheckCircle} color="white" size={20} />} colorScheme="dark" >
         Sync
      </Button>
        <Button ml={109} startIcon={<FontAwesomeIcon icon={ faCheckCircle } color="white" size={20} />} onPress={() => navigation.navigate('pickupbarcode')}>
        Continue
      </Button> */}
     
     </View>
        {/* save button end */}



</Container>
</Box>

          <Center>
          		<Image 
          			style={{
          			width:150, 
          			height:100
          			}}
          		       source={require('../../assets/image.png')} alt={"Logo Image"}
            	/>
          </Center>
 </NativeBaseProvider>

    );
};

export default ShipmentBarcode;

//Styles CSS

export const styles = StyleSheet.create({
  containter:{
    
    margin:0,
    marginVertical:0,
    alignSelf:'center',
},

Container1:{
  flex:1,
  flexDirection:'row',
  justifyContent:'space-between',

},


   normal:{

    fontFamily:'open sans',
    fontWeight:'normal',
    fontSize:15,
    color:'#eee',
    marginTop:20,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#eee',
    width:'90%',
    borderRadius:0
    
  },

    text:{
    
      color:'#000',
      fontWeight:'normal',
      paddingLeft:20,
      textAlign:'left',
      justifyContent:'space-around',
      fontSize:18

    },  

    btn:{

      
      marginTop:20,
      paddingBottom:10,
      paddingTop:10,
      backgroundColor:'#004aad',
      width: '75%',
      borderRadius:20,
      
      
    },
  
      btntext:{
        paddingLeft:30,
        paddingRight:30,
        color:'#fff',
        fontWeight:'normal',
        textAlign: 'center',
        fontSize:16
  
      },  
    
  mainbox:{
      marginTop:1,
      width:'70%'
    },
  smallbox:{
      
      textAlign:'left',
      flex:1,
      flexDirection:'row',
      justifyContent:'space-between',
      
    },
  text1:{
      color:'#000'
    },
  text2:{
      color:'#000'
    },
  text3:{
      color:'#000'
    },
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777'
    },
    textBold: {
      fontWeight: '500',
      color: '#000'
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
      padding: 16
    },
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777'
    },
    textBold: {
      fontWeight: '500',
      color: '#000'
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
      padding: 16
    },

    bt1:{
      fontFamily:'open sans',
      fontSize:15,
      lineHeight:10,
      marginTop:5,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#004aad',
      width:110,
      borderRadius:10,
      paddingLeft:0,
},
bt2:{
      fontFamily:'open sans',
      color:'#000',
      fontWeight:'bold',
      fontSize:15,
      lineHeight:10,
      marginTop:-40,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#004aad',
      width:110,
      borderRadius:10,
      paddingLeft:0,
      marginLeft:150
},
btnText:{
  alignSelf: 'center',
  color:'#fff',
  fontSize:15
}
});
