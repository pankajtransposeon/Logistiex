import React, { useEffect, useState } from 'react'

import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking
  } from 'react-native';
  
  import QRCodeScanner from 'react-native-qrcode-scanner';
  import { RNCamera } from 'react-native-camera';

const NewBarcode = ({navigation}) => {
    const [barcode, setBarcode] = useState("");
    const onSuccess = e => {
        setBarcode(e.data);
    }

    useEffect(() => {
        if(barcode != ""){
            navigation.navigate('ShipmentBarcode',{
                barcode,
            });
        }
    }, [barcode, setBarcode]);

  return (
    <QRCodeScanner
    onRead={onSuccess}
    flashMode={RNCamera.Constants.FlashMode.off}
    topContent={
      <Text style={styles.centerText}>
        Go to{' '}
        <Text style={styles.textBold}></Text> 
      </Text>
    }
    bottomContent={
      <TouchableOpacity style={styles.buttonTouchable}>
        <Text style={styles.buttonText}>OK. Got it!</Text>
      </TouchableOpacity>
    }
  />
  )
}

const styles = StyleSheet.create({
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
    }
  })

export default NewBarcode