import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Text, Divider, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { fetchSettingsRequest, toggleTheme } from '../redux/actions';
import { APP_VERSION } from '../constants/appInfo';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { settings, isDarkMode } = useSelector((state: RootState) => state.settings);
  const selectedDevice = useSelector((state: RootState) => state.device.selectedDevice);

  useEffect(() => {
    if (selectedDevice) {
      dispatch(fetchSettingsRequest());
    }
  }, [selectedDevice, dispatch]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>General</List.Subheader>
        <List.Item
          title="Dark Mode"
          right={() => <Switch value={isDarkMode} onValueChange={handleThemeToggle} />}
        />
      </List.Section>

      <Divider />

      {settings && (
        <>
          <List.Section>
            <List.Subheader>Cache</List.Subheader>
            <List.Item
              title="Cache Size"
              description={`${(settings.cache.currentSize / 1024 / 1024 / 1024).toFixed(2)} GB / ${(settings.cache.maxSize / 1024 / 1024 / 1024).toFixed(2)} GB`}
            />
            <List.Item
              title="Auto Cleanup"
              right={() => <Switch value={settings.cache.autoCleanup} />}
            />
          </List.Section>

          <Divider />

          <List.Section>
            <List.Subheader>Playback</List.Subheader>
            <List.Item
              title="Default Quality"
              description={settings.playback.defaultQuality}
            />
            <List.Item
              title="Hardware Acceleration"
              right={() => <Switch value={settings.playback.hardwareAcceleration} />}
            />
            <List.Item
              title="Auto Play Next"
              right={() => <Switch value={settings.playback.autoPlayNext} />}
            />
          </List.Section>

          <Divider />

          <List.Section>
            <List.Subheader>Display</List.Subheader>
            <List.Item
              title="Resolution"
              description={settings.display.resolution}
            />
            <List.Item
              title="Aspect Ratio"
              description={settings.display.aspectRatio}
            />
            <List.Item
              title="Screen Saver"
              right={() => <Switch value={settings.display.screenSaverEnabled} />}
            />
          </List.Section>
        </>
      )}

      <Divider />

      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="Version"
          description={APP_VERSION}
        />
        <List.Item
          title="Connected Device"
          description={selectedDevice?.deviceName || 'No device selected'}
        />
      </List.Section>

      <View style={styles.actions}>
        <Button mode="outlined" style={styles.button}>
          Clear Cache
        </Button>
        <Button mode="outlined" style={styles.button}>
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actions: {
    padding: 16,
  },
  button: {
    marginBottom: 10,
  },
});
