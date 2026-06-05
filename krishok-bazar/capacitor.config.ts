// Capacitor config for Android APK build
// Run: npm install @capacitor/core @capacitor/cli @capacitor/android
// Then: npx cap add android && npx cap sync && npx cap open android

export default {
  appId: 'com.krishokbazar.app',
  appName: 'কৃষক বাজার',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#ffffff',
    overScrollMode: 'never',
    initialFocus: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1B5E20',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1B5E20',
    },
  },
} as const;
