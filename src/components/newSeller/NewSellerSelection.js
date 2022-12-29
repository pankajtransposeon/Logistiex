/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Image, Center,NativeBaseProvider } from 'native-base';
import{StyleSheet,Text,TouchableOpacity,View, ScrollView, TextInput,getPick, Alert, TouchableWithoutFeedbackBase} from 'react-native';
import call from 'react-native-phone-call';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Pie from 'react-native-pie'	
import { openDatabase } from "react-native-sqlite-storage";	
const db = openDatabase({	
  name: "rn_sqlite",	
});	


const NewSellerSelection = ({route}) => {
  const [barcodeValue,setBarcodeValue] = useState("");
  const [showline, setLine] = useState(true)
  const shipmentData = `https://bked.logistiex.com/SellerMainScreen/getSellerDetails/${route.params.paramKey}`;	
  const [acc, setAcc] = useState(0);	
  const [pending, setPending] = useState(0);	
  const [reject, setReject] = useState(0);
  const [data,setData] = useState([]);
  const [order, setOrder] = useState([]);
  const [newdata, setnewdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState(route.params.phone);
  const [type,setType] = useState('');
  const navigation = useNavigation();
    
  let r = [];	
    useEffect(() => 	
     {	
      (async() => {	
        db.transaction((tx) => {	
          tx.executeSql(	
            'SELECT * FROM categories where ScanStatus = ?',	
            [1],	
            (tx, results) => {	
              var len = results.rows.length;	
              console.log(len);	
              setAcc(len);	
              setPending(route.params.Forward - len);	
            }	
          );	
        });	
      }) ();	
     }	
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[]);
 	
  const toggleLoading = () => {
    setIsLoading(!isLoading);
      (async() => {
        await axios.get(shipmentData)
        .then((res) => {
          setData(res.data)
    }, (error) => {
        alert(error);
    });    
    }) ();
    setIsLoading ? navigation.navigate('loading1') : null;
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('NewSellerSelection');
      }, 3000);
    };

  const triggerCall=() =>{
    const args = {
      number: phone,
      prompt: false, }
      call(args).catch(console.error);
  };

  var TotalpickUp = 0;
  var CompletePickUp = 0;
  let net = TotalpickUp - CompletePickUp;

  useEffect(() => {
    let addresss = "";
    if(route && route.params){
      addresss += route.params.consignorAddress.consignorAddress1;
      addresss += " ";
      addresss += route.params.consignorAddress.consignorAddress2;
      addresss += " ";
      addresss += route.params.consignorAddress.consignorCity;
      addresss += " ";
      addresss += route.params.consignorAddress.consignorPincode
    } 
     setType(addresss);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

return (
  <NativeBaseProvider >
  <View>
    <TouchableOpacity>
      <View style={styles.normal}>
        <Text style={styles.text}>Seller Pickups  {route.params.Forward} </Text>
      </View>
    </TouchableOpacity>
    <View style={{paddingVertical: 15, flexDirection: 'row',width: 350,justifyContent:'center',alignItems:'center'}}>
      <Pie radius={80}
        sections={[
          {
            percentage: ((acc/(route.params.Forward))*100),
            color: '#C70039',
          },
          {
            percentage: ((pending/(route.params.Forward))*100),
            color: '#44CD40',
          },
          ]}
          strokeCap={'butt'}
          />
      </View>
      <View style={styles.containter}>
        <ScrollView style={styles.homepage} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>       
        <View style={styles.searchbar}></View>
        <View style={styles.iconbar}>
          <TouchableOpacity style={[styles.scanbtn,{backgroundColor:'#44CD40'}]}
            onPress={()=>setLine(true)} ><Text style={{color:'#000'}}>{pending}</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.scanbtn2,{backgroundColor:'#C70039'}]} 
            onPress={()=>setLine(false)}><Text style={{color:'blue'}}>{acc}</Text></TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.containter}>
            <View  style={styles.mainbox}>
              <TouchableOpacity>
                <View style={styles.innerdown}>
                  <Text style={styles.fontvalue}>Seller Name</Text>
                  <Text style={styles.fontvalue}>{route.params.consignorName}</Text>
                </View>
                <View style={styles.innerdown}>
                  <Text style={styles.fontvalue}>Address</Text>
                  <Text style={styles.fontvalue}>{type} </Text>
                </View>
              </TouchableOpacity>
                <View style={styles.outerdown}>
                <View style={styles.outer1}><Text style={{color:'#6DB1E1',fontWeight:'700'}} onPress={triggerCall}>Call Seller</Text></View>
                <TouchableOpacity onPress={() => navigation.navigate('MapScreen', {
                        address : type,
                        latitude : 0,
                        longitude : 0
                  })} >
                <View style={styles.outer1}><Text style={{color:'#6DB1E1',fontWeight:'700'}}>Get Direction</Text></View>
                </TouchableOpacity>
                </View>
            </View>
         </View>
         </ScrollView>
      <TouchableOpacity onPress={()=>navigation.navigate('ShipmentBarcode',{
      Forward : route.params.Forward,
      PRSNumber : route.params.PRSNumber,
      consignorCode : route.params.consignorCode,
      userId : route.params.userId,
      phone : route.params.phone,
      packagingId : route.params.packagingId
    //   TotalpickUp : newdata[0].totalPickups
     })}>
      <View style={styles.bt1}>
        {/* <FontAwesomeIcon icon={faQrcode } color="black" size={25} style={{marginLeft:8,marginTop:8}} /> */}
      	<Text style={styles.text1}>Scan</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity  onPress={toggleLoading}> 
      <View style={styles.bt3}>
      	<Text style={styles.text1}>Sync</Text>
      </View>
    </TouchableOpacity>
  </ScrollView>
  </View>
  <Center>
    <Image style={{nwidth:150, height:150}} source={require('../../assets/image.png')} alt={"Logo Image"} />
  </Center>
</View>
    </NativeBaseProvider>
);
};

export default NewSellerSelection;
export const styles = StyleSheet.create({

scanbtn:{
  width:140,
  height:50,
  color:'white',
  borderBottomColor:'red',
  borderBottomWidth:2,
  alignItems:'center',
  justifyContent:'center',
  backgroundColor:'white'
},
scanbtn2:{
  width:140,
  height:50,
  color:'white',
  borderBottomColor:'green',
  borderBottomWidth:2,
  // color:'white',
  marginLeft:2,
  alignItems:'center',
  justifyContent:'center',
  backgroundColor:'white'
},
iconbar:{
  marginTop:10,
  marginLeft:30,
  flexDirection:'row',
  alignItems:'center',
  width:'100%',
  // backgroundColor:'green'
},
containter:{
  marginTop:0,
  marginVertical:0,
  alignSelf:'center',
},
searchbar:{
  width:280
},
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
  paddingLeft:30,
  color:'#000',
  fontWeight:'bold',
  fontSize:18
},
text1:{
  alignSelf: 'center',
  color:'#fff',
  fontWeight:'bold',
  fontSize:18
},
bt1:{
  fontFamily :'open sans',
  fontSize:15,
  lineHeight:10,
  marginTop:30,
  paddingTop:10,
  paddingBottom:10,
  backgroundColor:'#004aad',
  width:100,
  borderRadius:10,
  paddingLeft:0,
  marginLeft:0
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
  marginLeft:110
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
  width:100,
  borderRadius:10,
  paddingLeft:0,
  marginLeft:220
},
// containter:{
//   marginTop:30,
//   marginVertical:0,
//   alignSelf:'center',
// },
mainbox:{
  width: 340,
  height:'auto',
  backgroundColor:'white',
  alignSelf:'center',
  marginVertical:20,
  borderRadius:20,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.44,
  shadowRadius: 10.32,
  elevation: 1,
},
innerup:{
  flexDirection:'row',
  justifyContent:'space-around',
  padding:10,
},
innerdown:{
  flexDirection:'row',
  justifyContent:'space-between',
  paddingVertical:10
},
outerdown:{
  flexDirection:'row',
  justifyContent:'space-between',
  paddingVertical:15,
  borderTopWidth:2,
  borderColor: '#F4F4F4',
},
outer1:{
  paddingLeft:10,
  paddingRight:10
},
fontvalue:{
  padding:10,
  fontWeight:'700',
  color : "black"
},
container69: { 
  alignItems: 'center', 
  justifyContent: 'center', 
  height: 250
},
gauge: {
  position: 'absolute',
  width: 100,
  height: 160,
  alignItems: 'center',
  justifyContent: 'center',
},
gaugeText: {
  backgroundColor: 'transparent',
  color: '#000',
  fontSize: 24,
},
});
