import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { discoverDevicesRequest, selectDevice } from '../redux/actions';
import { Device } from '../utils/types';

export default function DevicesScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { discoveredDevices, pairedDevices, selectedDevice, isDiscovering } = useSelector(
    (state: RootState) => state.device
  );

  useEffect(() => {
    dispatch(discoverDevicesRequest());
  }, [dispatch]);

  const handlePairDevice = (device: Device) => {
    dispatch(selectDevice(device));
    navigation.navigate('Pairing', { device });
  };

  const handleSelectDevice = (device: Device) => {
    dispatch(selectDevice(device));
  };

  const renderDevice = ({ item }: { item: Device }) => {
    const isSelected = selectedDevice?.deviceId === item.deviceId;
    const isPaired = pairedDevices.some(d => d.deviceId === item.deviceId);

    return (
      <Card style={[styles.card, isSelected && styles.selectedCard]}>
        <Card.Content>
          <Text variant="titleMedium">{item.deviceName}</Text>
          <Text variant="bodySmall">
            {item.ipAddress}:{item.port || 8080}
          </Text>
          {isPaired && <Text variant="bodySmall">✓ Paired</Text>}
        </Card.Content>
        <Card.Actions>
          {isPaired ? (
            <Button onPress={() => handleSelectDevice(item)}>
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          ) : (
            <Button onPress={() => handlePairDevice(item)}>Pair</Button>
          )}
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          mode="contained"
          onPress={() => dispatch(discoverDevicesRequest())}
          loading={isDiscovering}
          disabled={isDiscovering}
        >
          {isDiscovering ? 'Searching...' : 'Search for Devices'}
        </Button>
      </View>

      {isDiscovering && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text>Scanning for TV Box devices...</Text>
        </View>
      )}

      <FlatList
        data={[...pairedDevices, ...discoveredDevices]}
        renderItem={renderDevice}
        keyExtractor={item => item.deviceId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No devices found. Make sure your TV Box is turned on and connected to the same network.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  loading: {
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: '#6200EE',
    borderWidth: 2,
  },
  empty: {
    padding: 20,
    alignItems: 'center',
  },
});
