import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { pairDeviceRequest } from '../redux/actions';
import { apiClient } from '../services';
import DeviceInfo from 'react-native-device-info';

const APP_VERSION = '1.0.0';

export default function PairingScreen({ route, navigation }: any) {
  const [pinCode, setPinCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const dispatch = useDispatch();
  const { isPairing, error } = useSelector((state: RootState) => state.device);
  const device = route.params?.device;

  React.useEffect(() => {
    if (device) {
      apiClient.setBaseURL(device.ipAddress, device.port || 8080);
      requestPairingSession();
    }
  }, [device]);

  const requestPairingSession = async () => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const response = await apiClient.requestPairing(
        deviceName || `${Platform.OS} Device`,
        'mobile',
        Platform.OS,
        APP_VERSION
      );
      setSessionId(response.session_id);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to initiate pairing. Please try again.');
    }
  };

  const handlePair = () => {
    if (pinCode.length !== 6) {
      Alert.alert('Invalid PIN', 'Please enter a 6-digit PIN code.');
      return;
    }

    dispatch(pairDeviceRequest(sessionId, pinCode, device.deviceName));
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Pairing Failed', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Pair with {device?.deviceName}
      </Text>

      <Text variant="bodyMedium" style={styles.instruction}>
        Enter the 6-digit PIN code displayed on your TV screen:
      </Text>

      <TextInput
        mode="outlined"
        label="PIN Code"
        value={pinCode}
        onChangeText={setPinCode}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
        disabled={isPairing}
      />

      <Button
        mode="contained"
        onPress={handlePair}
        loading={isPairing}
        disabled={isPairing || pinCode.length !== 6}
        style={styles.button}
      >
        {isPairing ? 'Pairing...' : 'Pair Device'}
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        disabled={isPairing}
      >
        Cancel
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  instruction: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
  },
  button: {
    marginBottom: 10,
  },
});
