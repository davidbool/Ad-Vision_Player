import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { loginRequest, loginWithGoogle, registerRequest } from '../redux/actions';

type Mode = 'login' | 'register';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters.');
        return;
      }
      dispatch(registerRequest(email.trim(), password));
    } else {
      dispatch(loginRequest(email.trim(), password));
    }
  };

  const handleGoogleSignIn = () => {
    dispatch(loginWithGoogle());
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text variant="headlineLarge" style={styles.title}>
          Ad-Vision Player
        </Text>

        <Text variant="bodyMedium" style={styles.subtitle}>
          {mode === 'login' ? 'Sign in to continue' : 'Create a new account'}
        </Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          style={styles.input}
          disabled={isLoading}
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={mode === 'register' ? 'new-password' : 'password'}
          style={styles.input}
          disabled={isLoading}
        />

        {mode === 'register' && (
          <TextInput
            mode="outlined"
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="new-password"
            style={styles.input}
            disabled={isLoading}
          />
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>

        <Divider style={styles.divider} />

        <Button
          mode="outlined"
          onPress={handleGoogleSignIn}
          disabled={isLoading}
          icon="google"
          style={styles.button}
        >
          Continue with Google
        </Button>

        <Button
          mode="text"
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          disabled={isLoading}
          style={styles.switchMode}
        >
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  errorText: {
    color: '#B00020',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
  switchMode: {
    marginTop: 8,
  },
});
