import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NativeBaseProvider, Box, Image, Center, VStack, Button, Input, Alert, Text, Modal } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, PermissionsAndroid, TouchableOpacity, View, ScrollView } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import {openDatabase} from 'react-native-sqlite-storage';
const db = openDatabase({name: 'rn_sqlite'});
export default function MyTrip({ navigation, route }) {

  const [vehicle, setVehicle] = useState('');
  const [startkm, setStartKm] = useState('');
  const [endkm, setEndkm] = useState('');
  const [startImageUrl, setStartImageUrl] = useState('');
  const [endImageUrl, setEndImageUrl] = useState('');
  const [tripID, setTripID] = useState("");
  const [userId, setUserId] = useState(route.params.userId);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [modalVisible, setModalVisible] = useState(false);
  const [tripAlreadyStarted, setTripAlreadyStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingPickup, setPendingPickup] = useState(0);
  const [pendingDelivery, setPendingDelivery] = useState(0);

  let current = new Date();
  let tripid = current.toString();
  let time = tripid.match(/\d{2}:\d{2}:\d{2}/)[0];
  let dateStart = 0;
  let dateEnd = tripid.indexOf(" ", tripid.indexOf(" ", tripid.indexOf(" ") + 1) + 1);
  let date = dateEnd ? tripid.substring(dateStart, dateEnd + 5) : "No match found";

  useEffect(() => {
    if(userId){
      setTripID(userId + "_" + date);
      getVehicleNumber(userId);
      getTripDetails(userId + "_" + date);
    }
  }, [userId]);

  function getVehicleNumber(userId){
    axios.get(`https://bkedtest.logistiex.com/SellerMainScreen/vehicleNumber/${userId}`)
    .then(response => {
      if(response?.data?.data?.vehicleNumber){
        setVehicle(response.data.data.vehicleNumber);
      }
    })
    .catch(error => {
      console.log(error, 'error');
    });
  }

  function getTripDetails(tripId){
    axios.get("https://bkedtest.logistiex.com/UserTripInfo/getUserTripInfo", {
      params: {
        tripID: tripId, 
      }
    })
    .then(response => {
      if(response?.data?.res_data){
        setTripAlreadyStarted(true);
        setVehicle(response.data.res_data.vehicleNumber);
        setStartKm(response.data.res_data.startKilometer);
        if(response.data.res_data.endkilometer){
          navigation.navigate('StartEndDetails', {tripID:tripId});
        }
      }
      setLoading(false);
    })
    .catch(error => {
      console.log(error, 'error');
      setLoading(false);
    });
  }
useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Pickup" AND status IS NULL', [], (tx1, results) => {
          setPendingPickup(results.rows.length);
      });
  });

    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND status IS NULL', [], (tx1, results) => {
            setPendingDelivery(results.rows.length);
        });
    });
  }, []);
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const createFormData = (photo, body) => {
    const data = new FormData();

    data.append("file", {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    return data;
  };

  const takeStartPhoto= async()=>{
    setUploadStatus('uploading');
    setStartImageUrl("");
    let options = {
      mediaType:'photo',
      quality:1,
      cameraType:'back',
      maxWidth : 480,
      maxHeight : 480,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }
    let isGranted = await requestCameraPermission();
    let result = null;
    if(isGranted){
      result = await launchCamera(options);
    }
    if(result.assets !== undefined){          
      fetch('https://bkedtest.logistiex.com/DSQCPicture/uploadPicture', {
        method: 'POST',
        body: createFormData(result.assets[0], {
          useCase : "DSQC",
          type : "front",
          contextId : "SI002",
          contextType: "shipment",
          hubCode :"HC001"
        }),
      })
      .then((data) => data.json())
      .then((res) => {
        setStartImageUrl(res.publicURL);
        setUploadStatus('done');
      })
      .catch((error) => {
        console.log('upload error', error);
        setUploadStatus('error')
      });
    }
  }

  const takeEndPhoto = async () => {
    setUploadStatus('uploading');
    setEndImageUrl("");
    let options = {
      mediaType: 'photo',
      quality: 1,
      cameraType: 'back',
      maxWidth: 480,
      maxHeight: 480,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }
    let isGranted = await requestCameraPermission();
    let result = null;
    if (isGranted) {
      result = await launchCamera(options);
    }
    if (result.assets !== undefined) {
      fetch('https://bkedtest.logistiex.com/DSQCPicture/uploadPicture', {
        method: 'POST',
        body: createFormData(result.assets[0], {
          useCase: "DSQC",
          type: "front",
          contextId: "SI002",
          contextType: "shipment",
          hubCode: "HC001"
        }),
      })
      .then((data) => data.json())
      .then((res) => {
        setEndImageUrl(res.publicURL);
        setUploadStatus('done');
      })
      .catch((error) => {
        console.log('upload error', error);
        setUploadStatus('error');
      });
    }
  }

  const submitEndTrip = () => {
    (async () => {
      await axios.post('https://bkedtest.logistiex.com/UserTripInfo/updateUserTripEndDetails', {
        tripID: tripID,
        endTime: time,
        endkilometer: endkm,
        endVehicleImageUrl: endImageUrl
      })
      .then(function (res) {
        getTripDetails(tripID);
        setMessage(1);
        navigation.navigate('StartEndDetails', {tripID:tripId});
      })
      .catch(function (error) {
        console.log(error);
      });
    })();
  }

  const submitStartTrip = () =>  {
    (async() => {
      await axios.post('https://bkedtest.logistiex.com/UserTripInfo/userTripDetails', {
        tripID : tripID, 
        userID : userId, 
        date : new Date(), 
        startTime : time,
        vehicleNumber : vehicle, 
        startKilometer : startkm, 
        startVehicleImageUrl : startImageUrl
      })
      .then(function (res) {
        if(res.data.msg=="TripID already exists"){
          getTripDetails(tripID);
          setMessage(2);
        }
        else {
          getTripDetails(tripID);
          setMessage(1);
          navigation.navigate('Main',{tripID:tripID});
        }
        setShowModal(true);
      })
      .catch(function (error) {
        console.log(error);
      });
    })();
  }

  return (
    <NativeBaseProvider>
      {loading ? 
        <ActivityIndicator size="large" color="blue" style={{marginTop: 44}} />
      :
        <Box flex={1}>
          {!tripAlreadyStarted ?
            <Box flex={1} bg="gray.300" alignItems="center" pt={'4%'}>
              <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content backgroundColor={message === 1 ? '#dcfce7' : '#fee2e2'}>
                  <Modal.CloseButton />
                  <Modal.Body>
                    <Alert w="100%" status={message === 1 ? 'success' : 'error'}>
                      <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                        <Alert.Icon size="4xl" />
                        <Text my={3} fontSize="md" fontWeight="medium">{message === 1 ? 'Data Successfully Submitted' : 'Trip ID already exists'}</Text>
                      </VStack>
                    </Alert>
                  </Modal.Body>
                </Modal.Content>
              </Modal>
              <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="lg">
              <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header />
                <Modal.Body>
                
                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center'}}>
                <Image 
                  source={{ uri: startImageUrl }} 
                  style={{ width: 400, height: 600 }} 
                  alt = 'image not shown'
                />
                </View>
                </Modal.Body>
              </Modal.Content>
            </Modal>
                  <Box justifyContent="space-between" py={10} px={6} bg="#fff" rounded="xl" width={"90%"} maxWidth="100%" _text={{fontWeight: "medium",}}>
                  <ScrollView>
                  <VStack space={6}>
                      <Input disabled selectTextOnFocus={false} editable={false} backgroundColor='gray.300' value={vehicle} size="lg" type={"number"} placeholder="Vehicle Number" />
                      <Input keyboardType="numeric" value={startkm} onChangeText={setStartKm} size="lg" type={"number"} placeholder="Input vehicle KMs" />
                      <Button py={3} variant='outline' _text={{ color: 'white', fontSize: 20 }} onPress={takeStartPhoto}>
                      {uploadStatus === 'idle' && <MaterialIcons name="cloud-upload" size={22} color="gray">  Image</MaterialIcons>}
                      {uploadStatus === 'uploading' && <ActivityIndicator size="small" color="gray" />}
                      {uploadStatus === 'done' && <MaterialIcons name="check" size={22} color="green" />}
                      {uploadStatus === 'error' && <MaterialIcons name="error" size={22} color="red" />}
                      </Button>
                      {
                        startImageUrl ? (
                          <TouchableOpacity onPress={() => setModalVisible(true)} >
                            <Image 
                            source={{ uri: startImageUrl }} 
                            style={{ width: 300, height: 200 }} 
                            alt = 'image not shown'
                          />
                          </TouchableOpacity>
                        ):(
                          null
                        )
                      }
                      {startkm && vehicle && startImageUrl && tripid ? (
                          <Button title="Login" backgroundColor= {'#004aad'} _text={{ color: 'white', fontSize: 20 }} onPress={()=>{submitStartTrip()}}>Start Trip</Button>
                        ) : (
                          <Button opacity={0.5}  disabled={true} title="Login" backgroundColor= {'#004aad'} _text={{ color: 'white', fontSize: 20 }}>Start Trip</Button>
                        )
                      }
                  </VStack>
                  </ScrollView>
                  <Center>
                <Image style={{ width: 150, height: 100 }} source={require('../assets/image.png')} alt={'Logo Image'} />
              </Center>
              </Box>
                  
              
            </Box>
          :
            <Box flex={1} bg="#004aad" alignItems="center" pt={'4%'}>
              <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="lg">
                <Modal.Content maxWidth="350">
                  <Modal.CloseButton />
                  <Modal.Header />
                  <Modal.Body>
                    <View style={{ alignSelf: 'center', marginVertical: 5 }}>
                      <Image
                        source={{ uri: endImageUrl }}
                        style={{ width: 400, height: 500 }}
                        alt='image not shown'
                      />
                    </View>
                  </Modal.Body>
                </Modal.Content>
              </Modal>
              <Box justifyContent="space-between" py={10} px={6} bg="#fff" rounded="xl" width={"90%"} maxWidth="100%" _text={{ fontWeight: "medium", }}>
                <VStack space={6}>
                  <Input disabled selectTextOnFocus={false} editable={false} backgroundColor='gray.300' value={vehicle} size="lg" type={"number"} placeholder="Vehicle Number" />

                  <Input selectTextOnFocus={false} editable={false} disabled backgroundColor='gray.300' value={startkm} size="lg" type={"number"} placeholder="Start Km" />

                  <Input value={endkm} keyboardType="numeric" onChangeText={setEndkm} size="lg" type={"number"} placeholder="Input End KMs" />
                  <Button py={3} variant='outline' _text={{ color: 'white', fontSize: 20 }} onPress={takeEndPhoto}>
                    {uploadStatus === 'idle' && <MaterialIcons name="cloud-upload" size={22} color="gray">  Image</MaterialIcons>}
                    {uploadStatus === 'uploading' && <ActivityIndicator size="small" color="gray" />}
                    {uploadStatus === 'done' && <MaterialIcons name="check" size={22} color="green" />}
                    {uploadStatus === 'error' && <MaterialIcons name="error" size={22} color="red" />}
                  </Button>
                  {
                    endImageUrl ? (
                      <TouchableOpacity onPress={() => setModalVisible(true)} >
                            <Image 
                            source={{ uri: endImageUrl }} 
                            style={{ width: 300, height: 200 }} 
                            alt = 'image not shown'
                          />
                          </TouchableOpacity>
                    ) : (
                      null
                    )
                  }
                  {
          (pendingPickup && pendingDelivery) ? (
          <Button 
         backgroundColor='#004aad' 
         _text={{ color: 'white', fontSize: 20 }} 
         onPress={() => navigation.navigate('PendingWork')}
        >
        Pending Work
      </Button>
      ) : (
     endkm && ImageUrl && (endkm > startkm) ? (
      <Button 
        backgroundColor='#004aad' 
        _text={{ color: 'white', fontSize: 20 }} 
        onPress={() => ImageHandle()}
      >
        End Trip
      </Button>
    ) : (
      <Button 
        opacity={0.5} 
        disabled={true}  
        backgroundColor='#004aad' 
        _text={{ color: 'white', fontSize: 20 }}
      >
        End Trip
      </Button>
    )
  )
}
                </VStack>
              </Box>
              <Center>
                <Image style={{ width: 200, height: 200 }} source={require('../assets/logo.png')} alt={"Logo Image"} />

              </Center>
            </Box>
          }
        </Box>
      }
    </NativeBaseProvider>
  );
}
