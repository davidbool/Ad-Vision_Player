import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, FAB, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { fetchPlaylistsRequest, deletePlaylistRequest, startPlaybackRequest } from '../redux/actions';
import { Playlist } from '../utils/types';

export default function PlaylistsScreen() {
  const dispatch = useDispatch();
  const { playlists, isLoading } = useSelector((state: RootState) => state.playlist);

  useEffect(() => {
    dispatch(fetchPlaylistsRequest());
  }, [dispatch]);

  const handlePlayPlaylist = (playlistId: string) => {
    dispatch(startPlaybackRequest(playlistId, 0));
  };

  const handleDeletePlaylist = (playlistId: string) => {
    dispatch(deletePlaylistRequest(playlistId));
  };

  const renderPlaylist = ({ item }: { item: Playlist }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleSection}>
            <Text variant="titleMedium">{item.name}</Text>
            {item.description && (
              <Text variant="bodySmall">{item.description}</Text>
            )}
          </View>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeletePlaylist(item.playlistId)}
          />
        </View>
        <Text variant="bodySmall">
          {item.itemCount} items • {item.totalDuration ? `${Math.floor(item.totalDuration / 60)} min` : 'Unknown duration'}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handlePlayPlaylist(item.playlistId)}>
          Play
        </Button>
        <Button>Edit</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={playlists}
        renderItem={renderPlaylist}
        keyExtractor={item => item.playlistId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No playlists yet. Create your first playlist to get started!</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        label="New Playlist"
        style={styles.fab}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
  },
  empty: {
    padding: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
