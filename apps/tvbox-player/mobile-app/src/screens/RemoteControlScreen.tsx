import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, IconButton, Slider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import {
  controlPlaybackRequest,
  fetchPlaybackStatusRequest,
  startPlaybackRequest,
  stopPlaybackRequest,
} from '../redux/actions';
import { PLAYBACK_STATUS } from '../constants';

export default function RemoteControlScreen() {
  const dispatch = useDispatch();
  const { status } = useSelector((state: RootState) => state.playback);
  const selectedDevice = useSelector((state: RootState) => state.device.selectedDevice);

  useEffect(() => {
    if (selectedDevice) {
      dispatch(fetchPlaybackStatusRequest());
      const interval = setInterval(() => {
        dispatch(fetchPlaybackStatusRequest());
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedDevice, dispatch]);

  const handleControl = (action: string, params?: any) => {
    dispatch(controlPlaybackRequest(action, params));
  };

  const handleSeek = (position: number) => {
    dispatch(controlPlaybackRequest('seek', { position }));
  };

  const handleVolumeChange = (volume: number) => {
    dispatch(controlPlaybackRequest('set_volume', { volume }));
  };

  if (!selectedDevice) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please select a TV Box device first</Text>
      </View>
    );
  }

  const isPlaying = status.status === PLAYBACK_STATUS.PLAYING;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusSection}>
        <Text variant="titleLarge">Now Playing</Text>
        {status.currentItem ? (
          <>
            <Text variant="titleMedium">{status.currentItem.filename}</Text>
            <Text variant="bodySmall">
              {Math.floor(status.playbackPosition / 60)}:
              {(Math.floor(status.playbackPosition) % 60).toString().padStart(2, '0')} /
              {status.currentItem.duration 
                ? ` ${Math.floor(status.currentItem.duration / 60)}:${(Math.floor(status.currentItem.duration) % 60).toString().padStart(2, '0')}`
                : ' --:--'}
            </Text>
          </>
        ) : (
          <Text variant="bodyMedium">No media playing</Text>
        )}
      </View>

      {status.currentItem && (
        <View style={styles.seekSection}>
          <Slider
            value={status.playbackPosition}
            minimumValue={0}
            maximumValue={status.currentItem.duration || 100}
            onSlidingComplete={handleSeek}
            style={styles.slider}
          />
        </View>
      )}

      <View style={styles.controlsSection}>
        <View style={styles.mainControls}>
          <IconButton
            icon="skip-previous"
            size={40}
            onPress={() => handleControl('previous')}
          />
          <IconButton
            icon={isPlaying ? 'pause-circle' : 'play-circle'}
            size={64}
            onPress={() => handleControl(isPlaying ? 'pause' : 'play')}
          />
          <IconButton
            icon="skip-next"
            size={40}
            onPress={() => handleControl('next')}
          />
        </View>

        <View style={styles.secondaryControls}>
          <IconButton
            icon="stop"
            size={32}
            onPress={() => dispatch(stopPlaybackRequest())}
          />
        </View>
      </View>

      <View style={styles.volumeSection}>
        <Text variant="titleSmall">Volume: {status.volume}%</Text>
        <Slider
          value={status.volume}
          minimumValue={0}
          maximumValue={100}
          onSlidingComplete={handleVolumeChange}
          style={styles.slider}
        />
      </View>

      <View style={styles.speedSection}>
        <Text variant="titleSmall">Playback Speed: {status.playbackSpeed}x</Text>
        <View style={styles.speedButtons}>
          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
            <Button
              key={speed}
              mode={status.playbackSpeed === speed ? 'contained' : 'outlined'}
              onPress={() => handleControl('set_speed', { speed })}
              style={styles.speedButton}
            >
              {speed}x
            </Button>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    flex: 1,
    textAlign: 'center',
    marginTop: 100,
  },
  statusSection: {
    padding: 20,
    alignItems: 'center',
  },
  seekSection: {
    paddingHorizontal: 20,
  },
  controlsSection: {
    padding: 20,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  volumeSection: {
    padding: 20,
  },
  speedSection: {
    padding: 20,
  },
  speedButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  speedButton: {
    margin: 4,
  },
  slider: {
    width: '100%',
  },
});
