//01: Login Screen 

import React, { useState } from 'react';
import axios from 'axios';
import {
  NativeBaseProvider, Box, Text, Image, Center, Heading, VStack, FormControl,
  Input, Link, Button, Icon, IconButton, HStack, Divider
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import {loginUrl} from './Config';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // console.log(email, password)
    // navigation.navigate('Main');

    axios.post(loginUrl, { email: email, password: password })
      .then((response) => {
        console.log("userId", response.data.userDetails.userId);	
        navigation.navigate('Main', {	
        userId : response.data.userDetails.userId	
        });

      }, (error) => {
        alert(error);
      });
  }

  return (

    <NativeBaseProvider>
      <Box flex={1} bg="#004aad" alignItems="center" justifyContent="center">
        <Box justifyContent="space-between" py={8} px={6} bg="#fff" rounded="xl" width={350} maxWidth="100%"
          _text={{
            fontWeight: "medium",
          }}>
            <VStack space={2} mt={8}>
              <FormControl>
                <FormControl.Label _text={{ color: '#000', fontSize: 'md', fontWeight: 700 }}>Email ID</FormControl.Label>
                <Input style={{ backgroundColor: '#eee' }} value={email} onChangeText={setEmail} />
              </FormControl>

              <FormControl mb={5}>
                <FormControl.Label _text={{ color: '#000', fontSize: 'md', fontWeight: 700 }}>Password</FormControl.Label>
              </FormControl>
              <Input style={{ backgroundColor: '#eee' }} type="password" value={password} onChangeText={setPassword} />
              

              <VStack space={2}>
                <Button title="Login" backgroundColor='#004aad' _text={{ color: 'white', fontSize: 20 }} onPress={handleLogin}>LOGIN
                </Button>
              </VStack>
            </VStack>
        </Box>
          <Center>
            <Image
              style={{
                width: 150,
                height: 150
              }}
              source={require('../file/logo.png')} alt={"Logo Image"}
            />
         </Center>
      </Box>
    </NativeBaseProvider>
  );
}
