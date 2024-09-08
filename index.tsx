import '@expo/metro-runtime';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import {Amplify} from 'aws-amplify'

import aws_exports from './amplify_outputs.json';
Amplify.configure(aws_exports)

renderRootComponent(App);