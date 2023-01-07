import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {NativeBaseProvider, Box, Center, VStack, Button, Icon, Input, Heading, Alert, Text, Modal, ScrollView, AspectRatio, Stack, HStack, Divider, Fab } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, View } from 'react-native';


export default function NewSellerAdditionNotification() {

  const [vehicle, setVehicle] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(0);
  const [data, setData] = useState();
  const [printData, setPrintData] = useState();
  const [loginClicked, setLoginClicked] = useState(false);
  const navigation = useNavigation();

  return (
    <NativeBaseProvider>
      <ScrollView>
      <Box flex={1} bg="white" p={4}>
      
                <Box  alignItems="center">
                    <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700"
                    }} _web={{
                        shadow: 2,
                        borderWidth: 0
                    }} _light={{
                        backgroundColor: "gray.50"
                    }}>
                    <Stack p="4" space={3}>
                        <HStack alignItems="center" space={4} justifyContent="space-between">
                            <HStack alignItems="center">
                                <Text color="gray.400" _dark={{
                                    color: "gray.400"
                                    }} fontWeight="400">
                                    Seller Name   Seller Code
                                </Text>
                            </HStack>
                            <HStack alignItems="center">
                                <Text color="gray.400" _dark={{
                                    color: "gray.400"
                                    }} fontWeight="400">
                                    100/20
                                </Text>
                            </HStack>
                        </HStack>
                        <Divider my="2" _light={{
                            bg: "muted.300"
                            }} _dark={{
                            bg: "muted.50"
                        }} />
                    <Stack space={2}>
                        <Heading size="md" ml="-1">
                            The Garden City
                        </Heading>
                    <Text fontSize="xs" _light={{
                        color: "violet.500"
                        }} _dark={{
                        color: "violet.400"
                        }} fontWeight="500" ml="-0.5" mt="-1">
                        The Silicon Valley of India.
                    </Text>
                    </Stack>
                <Text fontWeight="400">
                     Bengaluru (also called Bangalore) is the center of India's high-tech
                    industry. The city is also known for its parks and nightlife.
                </Text>
                <Divider my="2" _light={{
                    bg: "muted.300"
                    }} _dark={{
                    bg: "muted.50"
                }} />
                <HStack alignItems="center" space={4} justifyContent="space-between">
                    <HStack alignItems="center">
                        <Text color="green.400" _dark={{
                            color: "Green.200"
                            }} fontWeight="400">
                            Accept
                        </Text>
                    </HStack>
                    <HStack alignItems="center">
                        <Text color="red.400" _dark={{
                            color: "warmRed.200"
                            }} fontWeight="400">
                            Reject
                        </Text>
                    </HStack>
                </HStack>
            </Stack>
            </Box>
        </Box>


        <Box alignItems="center" mt={4}>
                    <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700"
                    }} _web={{
                        shadow: 2,
                        borderWidth: 0
                    }} _light={{
                        backgroundColor: "gray.50"
                    }}>
                    <Stack p="4" space={3}>
                        <HStack alignItems="center" space={4} justifyContent="space-between">
                            <HStack alignItems="center">
                                <Text color="gray.400" _dark={{
                                    color: "gray.400"
                                    }} fontWeight="400">
                                    Seller Name   Seller Code
                                </Text>
                            </HStack>
                            <HStack alignItems="center">
                                <Text color="gray.400" _dark={{
                                    color: "gray.400"
                                    }} fontWeight="400">
                                    100/20
                                </Text>
                            </HStack>
                        </HStack>
                        <Divider my="2" _light={{
                            bg: "muted.300"
                            }} _dark={{
                            bg: "muted.50"
                        }} />
                    <Stack space={2}>
                        <Heading size="md" ml="-1">
                            The Garden City
                        </Heading>
                    <Text fontSize="xs" _light={{
                        color: "violet.500"
                        }} _dark={{
                        color: "violet.400"
                        }} fontWeight="500" ml="-0.5" mt="-1">
                        The Silicon Valley of India.
                    </Text>
                    </Stack>
                <Text fontWeight="400">
                     Bengaluru (also called Bangalore) is the center of India's high-tech
                    industry. The city is also known for its parks and nightlife.
                </Text>
                <Divider my="2" _light={{
                    bg: "muted.300"
                    }} _dark={{
                    bg: "muted.50"
                }} />
                <HStack alignItems="center" space={4} justifyContent="space-between">
                    <HStack alignItems="center">
                        <Text color="green.400" _dark={{
                            color: "Green.200"
                            }} fontWeight="400">
                            Accept
                        </Text>
                    </HStack>
                    <HStack alignItems="center">
                        <Text color="red.400" _dark={{
                            color: "warmRed.200"
                            }} fontWeight="400">
                            Reject
                        </Text>
                    </HStack>
                </HStack>
            </Stack>
            </Box>
        </Box>

        <Box alignItems="center" mt={4}>
                    <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700"
                    }} _web={{
                        shadow: 2,
                        borderWidth: 0
                    }} _light={{
                        backgroundColor: "gray.50"
                    }}>
                    <Stack p="4" space={3}>
                        <HStack alignItems="center" space={4} justifyContent="space-between">
                            <HStack alignItems="center">
                                <Text color="gray.400" _dark={{
                                    color: "gray.400"
                                    }} fontWeight="400">
                                    Seller Name   Seller Code
                                </Text>
                            </HStack>
                            <HStack alignItems="center">
                                <Text color="gray.400" _dark={{
                                    color: "gray.400"
                                    }} fontWeight="400">
                                    100/20
                                </Text>
                            </HStack>
                        </HStack>
                        <Divider my="2" _light={{
                            bg: "muted.300"
                            }} _dark={{
                            bg: "muted.50"
                        }} />
                    <Stack space={2}>
                        <Heading size="md" ml="-1">
                            The Garden City
                        </Heading>
                    <Text fontSize="xs" _light={{
                        color: "violet.500"
                        }} _dark={{
                        color: "violet.400"
                        }} fontWeight="500" ml="-0.5" mt="-1">
                        The Silicon Valley of India.
                    </Text>
                    </Stack>
                <Text fontWeight="400">
                     Bengaluru (also called Bangalore) is the center of India's high-tech
                    industry. The city is also known for its parks and nightlife.
                </Text>
                <Divider my="2" _light={{
                    bg: "muted.300"
                    }} _dark={{
                    bg: "muted.50"
                }} />
                <HStack alignItems="center" space={4} justifyContent="space-between">
                    <HStack alignItems="center">
                        <Text color="green.400" _dark={{
                            color: "Green.200"
                            }} fontWeight="400">
                            Accept
                        </Text>
                    </HStack>
                    <HStack alignItems="center">
                        <Text color="red.400" _dark={{
                            color: "warmRed.200"
                            }} fontWeight="400">
                            Reject
                        </Text>
                    </HStack>
                </HStack>
            </Stack>
            </Box>
        </Box>
        
        <Center>
          <Image style={{ width: 150, height: 100 }} source={require('../assets/image.png')} alt={"Logo Image"} />
        </Center>
      </Box>
      </ScrollView>
      
        
            
    </NativeBaseProvider>
  );
}
