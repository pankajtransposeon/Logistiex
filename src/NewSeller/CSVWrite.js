import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { writeFile, readFile,DocumentDirectoryPath,DownloadDirectoryPath } from 'react-native-fs';
import * as RNFS from 'react-native-fs';
import { CSVDownload } from 'react-csv';


const CSVWrite = ({route}) => {

  const Apidata = 'https://bked.logistiex.com/SellerMainScreen/getCP/Tarun123';

  const create =()=>{

    const c = new Date().getDate();
    const d =  new Date().getMonth() +1
    const e = new Date().getFullYear()
    const f = c+'.'+d+'.'+e 
    const values =r;
     
      const csvString = JSON.stringify(values);

      var RNFS = require('react-native-fs');
      

      var path1 = RNFS.DownloadDirectoryPath  + '/' + f+ '.json';

      RNFS.writeFile(path1, csvString, 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!', values);
        })
        .catch((err) => {
          console.log(err.message);
        });  
}

const UploadFile = () => {

  const c = new Date().getDate();
  const d = new Date().getMonth() + 1
  const e = new Date().getFullYear()
  const f = c + '.' + d + '.' + e

  var RNFS = require('react-native-fs');

  var path1 = RNFS.DownloadDirectoryPath + '/' + f + '.json';

  RNFS.readFile(path1, 'utf8')
    .then((success) => {
      console.log('FILE READ!');
      console.log(success.split('/n'));


      const arr = JSON.stringify(success);
      console.log('amit', success)

    })

    .catch((err) => {
      console.log(err.message);
    });
  };


const [isLoading, setLoading] = useState(true);
const [data, setData] = useState([]);

let r = [];
r = data;
useEffect(() => {
  setData([...route.params.dataa]);
   
}, []);

  return (
    <View>
       <TouchableOpacity onPress={()=>{create()}}>
    <View style={styles.main1} >
        <Text style={{color: 'black'}}>Save the sever data in csv file</Text>
    </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => UploadFile()}>
          <View style={styles.normal}>
            <Text style={styles.text}>Upload File</Text>
          </View>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default CSVWrite;