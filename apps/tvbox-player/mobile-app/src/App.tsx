import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import store from './redux/store';
import AppNavigator from './navigation';
import { lightTheme, darkTheme } from './theme';
import { useSelector } from 'react-redux';
import { RootState } from './redux/reducers';

function AppContent() {
  const isDarkMode = useSelector((state: RootState) => state.settings.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
        </SafeAreaView>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
