import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Searchbar, Chip, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { fetchMediaRequest, setMediaFilter, setMediaSort } from '../redux/actions';
import { MediaItem } from '../utils/types';

export default function MediaLibraryScreen() {
  const dispatch = useDispatch();
  const { items, isLoading, filters } = useSelector((state: RootState) => state.media);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchMediaRequest());
  }, [dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(setMediaFilter('search', query));
  };

  const handleFilterType = (type: string) => {
    const newType = filters.type === type ? undefined : type;
    dispatch(setMediaFilter('type', newType));
  };

  const renderMediaItem = ({ item }: { item: MediaItem }) => (
    <Card style={styles.card}>
      <Card.Cover
        source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/150' }}
      />
      <Card.Content>
        <Text variant="titleMedium" numberOfLines={1}>
          {item.filename}
        </Text>
        <Text variant="bodySmall">
          {item.mediaType.toUpperCase()} • {(item.size / 1024 / 1024).toFixed(1)} MB
        </Text>
        {item.duration && (
          <Text variant="bodySmall">
            Duration: {Math.floor(item.duration / 60)}:
            {(Math.floor(item.duration) % 60).toString().padStart(2, '0')}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search media..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        <View style={styles.filters}>
          <Chip
            selected={filters.type === 'video'}
            onPress={() => handleFilterType('video')}
            style={styles.chip}
          >
            Videos
          </Chip>
          <Chip
            selected={filters.type === 'image'}
            onPress={() => handleFilterType('image')}
            style={styles.chip}
          >
            Images
          </Chip>
          <Chip
            selected={filters.type === 'audio'}
            onPress={() => handleFilterType('audio')}
            style={styles.chip}
          >
            Audio
          </Chip>
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderMediaItem}
        keyExtractor={item => item.mediaId}
        contentContainerStyle={styles.list}
        numColumns={2}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No media items found. Sync content from cloud storage to get started.</Text>
          </View>
        }
      />

      <FAB
        icon="cloud-download"
        label="Sync Content"
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
  header: {
    padding: 16,
  },
  searchbar: {
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: 8,
  },
  list: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 8,
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
