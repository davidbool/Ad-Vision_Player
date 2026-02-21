import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DevicesScreen from '../screens/DevicesScreen';
import RemoteControlScreen from '../screens/RemoteControlScreen';
import MediaLibraryScreen from '../screens/MediaLibraryScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          switch (route.name) {
            case 'Devices':
              iconName = 'devices';
              break;
            case 'Remote':
              iconName = 'remote';
              break;
            case 'Media':
              iconName = 'folder-multiple-image';
              break;
            case 'Playlists':
              iconName = 'playlist-play';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Devices" 
        component={DevicesScreen}
        options={{ title: 'TV Box Devices' }}
      />
      <Tab.Screen 
        name="Remote" 
        component={RemoteControlScreen}
        options={{ title: 'Remote Control' }}
      />
      <Tab.Screen 
        name="Media" 
        component={MediaLibraryScreen}
        options={{ title: 'Media Library' }}
      />
      <Tab.Screen 
        name="Playlists" 
        component={PlaylistsScreen}
        options={{ title: 'Playlists' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
