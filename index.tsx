import '@expo/metro-runtime';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { initialise } from './src/utils/sentry';

initialise();
renderRootComponent(App);