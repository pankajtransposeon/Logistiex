import React, { useEffect , useState } from 'react';
import { StyleSheet, ScrollView , StatusBarr, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PieChart from 'react-native-pie-chart';
import Pie from 'react-native-pie';
import { marginBottom } from 'styled-system';


const getData = "https://bked.logistiex.com/SellerMainScreen/getMSD/HADWFE01";
const shipmentData = "https://bked.logistiex.com/SellerMainScreen/getSellerDetails/MOKA209401";

const Dashboard = ({route}) =>  {

      
      const[data, setData] = useState(0);
      const [count, setcount] = useState(0);
      const widthAndHeight = 100
      const series = [123, 321, 124, 789];
      const sliceColor = ['#BAEDBD','#C6BDEC','#6A6DF4', '#4CAF50', '#FF9800'];
  
      const sellerPickupdata=[
        {
          id:1,
          name:"Pickup Done",
          color:'#BAEDBD',
          count:200,
        },
        {
          id:2,
          name:"Pickup Pending",
          color:'#C6BDEC',
          count:150,
        },
        {
          id:3,
          name:"Not Picked",
          color:'#6A6DF4',
          count:60,
        },
        {
          id:4,
          name:"Rejected",
          color:'#18191B',
          count:10,
        },
      ]
      const sellerDeliveriesdata=[
        {
          id:1,
          name:"Completed",
          color:'#BAEDBD',
          count: 400,
        },
        {
          id:2,
          name:"Pending",
          color:'#C6BDEC',

        },
        {
          id:3,
          name:"Not Handed over",
          color:'#6A6DF4',
        },
        {
          id:4,
          name:"Rejected",
          color:'#18191B',
        },
      ]

      const customerpickupdata=[
        {
          id:1,
          name:"Pickup Done",
          color:'#BAEDBD',
          count:400,
        },
        {
          id:2,
          name:"Pickup Pending",
          color:'#C6BDEC',

        },
        {
          id:3,
          name:"Not Picked",
          color:'#6A6DF4',
        },
        {
          id:4,
          name:"Rejected",
          color:'#18191B',
        },
      ]
      const customerDeliveriesdata=[
        {
          id:1,
          name:"Delivered",
          color:'#BAEDBD',
          count:200,
        },
        {
          id:2,
          name:"Pending",
          color:'#C6BDEC',

        },
        {
          id:3,
          name:"Undelivered",
          color:'#6A6DF4',
        },
        
      ]

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

  
      return (
        <ScrollView style={{flex: 1}}>
          <View style={styles.container}>
            <View style ={{width:'100%', height:'auto',flexDirection:'row', backgroundColor:'#fff'}}>
              <View>
              {/* <Text style={styles.title}>Customer Pickups</Text>
                  <PieChart
                    widthAndHeight={widthAndHeight}
                    series={series}
                    sliceColor={sliceColor}/> */}
              
                  <Text style={styles.title}>Seller Pickups</Text>
                              <View style={{alignItems:'center', display:'flex', flexDirection:'row'}}>
                                 <View style={{width:'auto', alignItems:'center'}}>
                                     <Pie
                                         radius={80}
                                         innerRadius={50}
                                         sections={[
                                             {
                                                 percentage:60,
                                                 color:'#BAEDBD',
                                             },
                                             {
                                                 percentage:30,
                                                 color:'#C6BDEC',
                                             },
                                             {
                                                 percentage:20,
                                                 color:'#6A6DF4',
                                             },
                                             {
                                                 percentage:10,
                                                 color:'#18191B',
                                          },
                                         ]}

                                         coverFill={'#eee'}
                                         
                                     />
                                 </View>
                             </View>

              </View>
              <View style={{marginTop:50, marginLeft:30}}>
              <Text style={{fontSize:16, fontWeight:'bold', color:'#000', marginBottom:5}}>Total Sellers  ( {data} )</Text>
                {
                  sellerPickupdata.map((item,index)=>
                  
                  <View style={{flexDirection:'row'}} key ={index}>
                      <View style={{justifyContent:'space-evenly',marginLeft:0,padding:10}}>
                        <Text style={{backgroundColor:item.color, borderRadius:10,width:10,height:10}}></Text>
                      </View>
                    <View>
                      
                      <Text style={{color:'#000', justifyContent:'space-evenly'}}>{item.name} {item.count}</Text>
                    </View>
                  </View>

                
                
                )
               }
              </View>
            </View>
            <View style ={{width:'100%', height:'auto',flexDirection:'row', backgroundColor:'#fff'}}>
              <View>
                <Text style={styles.title}>Seller Deliveries</Text>
                              <View style={{alignItems:'center', display:'flex', flexDirection:'row'}}>
                                 <View style={{width:'auto', alignItems:'center'}}>
                                     <Pie
                                         radius={80}
                                         innerRadius={50}
                                         sections={[
                                             {
                                                 percentage:60,
                                                 color:'#BAEDBD',
                                             },
                                             {
                                                 percentage:30,
                                                 color:'#C6BDEC',
                                             },
                                             {
                                                 percentage:20,
                                                 color:'#6A6DF4',
                                             },
                                             {
                                                 percentage:10,
                                                 color:'#18191B',
                                          },
                                         ]}

                                         coverFill={'#eee'}
                                         
                                     />
                                 </View>
                             </View>

              </View>
              <View style={{marginTop:50, marginLeft:40}}>
                {
                  sellerDeliveriesdata.map((item,index)=>
                  <View style={{flexDirection:'row'}} key ={index}>
                      <View style={{justifyContent:'space-evenly',marginLeft:0,padding:10}}>
                        <Text style={{backgroundColor:item.color, borderRadius:10,width:10,height:10}}></Text>
                      </View>
                    <View>
                      <Text style={{color:'#000', justifyContent:'space-evenly'}}>{item.name} {item.count}</Text>
                    </View>
                  </View>
                )
               }
              </View>
            </View>

            <View style ={{width:'100%', height:'auto',flexDirection:'row', backgroundColor:'#fff'}}>
              <View>
                <Text style={styles.title}>Customer Pickup</Text>
                              <View style={{alignItems:'center', display:'flex', flexDirection:'row'}}>
                                 <View style={{width:'auto', alignItems:'center'}}>
                                     <Pie
                                         radius={80}
                                         innerRadius={50}
                                         sections={[
                                             {
                                                 percentage:60,
                                                 color:'#BAEDBD',
                                             },
                                             {
                                                 percentage:30,
                                                 color:'#C6BDEC',
                                             },
                                             {
                                                 percentage:20,
                                                 color:'#6A6DF4',
                                             },
                                             {
                                                 percentage:10,
                                                 color:'#18191B',
                                          },
                                         ]}

                                         coverFill={'#eee'}
                                         
                                     />
                                 </View>
                             </View>

              </View>
              <View style={{marginTop:50, marginLeft:40}}>
                {
                  customerpickupdata.map((item,index)=>
                  <View style={{flexDirection:'row'}} key ={index}>
                      <View style={{justifyContent:'space-evenly',marginLeft:0,padding:10}}>
                        <Text style={{backgroundColor:item.color, borderRadius:10,width:10,height:10}}></Text>
                      </View>
                    <View>
                      <Text style={{color:'#000', justifyContent:'space-evenly'}}>{item.name} {item.count}</Text>
                    </View>
                  </View>
                )
               }
              </View>
            </View>

            <View style ={{width:'100%', height:'auto',flexDirection:'row', backgroundColor:'#fff'}}>
              <View>
                <Text style={styles.title}>Customer Deliveries</Text>
                              <View style={{alignItems:'center', display:'flex', flexDirection:'row'}}>
                                 <View style={{width:'auto', alignItems:'center'}}>
                                     <Pie
                                         radius={80}
                                         innerRadius={50}
                                         sections={[
                                             {
                                                 percentage:60,
                                                 color:'#BAEDBD',
                                             },
                                             {
                                                 percentage:30,
                                                 color:'#C6BDEC',
                                             },
                                             {
                                                 percentage:20,
                                                 color:'#6A6DF4',
                                             },
                                         ]}

                                         coverFill={'#eee'}
                                         
                                     />
                                 </View>
                             </View>

              </View>
              <View style={{marginTop:50, marginLeft:40}}>
                {
                  customerDeliveriesdata.map((item,index)=>
                  <View style={{flexDirection:'row'}} key ={index}>
                      <View style={{justifyContent:'space-evenly',marginLeft:0,padding:10}}>
                        <Text style={{backgroundColor:item.color, borderRadius:10,width:10,height:10}}></Text>
                      </View>
                    <View>
                      <Text style={{color:'#000', justifyContent:'space-evenly'}}>{item.name} {item.count}</Text>
                    </View>
                  </View>
                )
               }
              </View>
            </View>
          </View>
        </ScrollView>
     );
  }


export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
  },
  title: {
    fontSize: 16,
    fontWeight:'bold',
    margin:10
  }
});

