// // import { StatusBar } from 'expo-status-bar';
// // import { StyleSheet, Text, View } from 'react-native';

// // export default function App() {
// //   return (
// //     <View style={styles.container}>
// //       <Text>Open up App.js to start working on your app!</Text>
// //       <StatusBar style="auto" />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// // });
// import React from 'react';
// import { StyleSheet, View, Platform, useWindowDimensions, SafeAreaView, ScrollView, Text } from 'react-native';
// import { StatusBar } from 'expo-status-bar';

// // Import the actual components
// import Header from './src/components/Header';
// import Sidebar from './src/components/Sidebar';
// import SessionList from './src/components/SessionList';
// import BottomTabs from './src/components/BottomTabs';

// export default function App() {
//   const { width } = useWindowDimensions();
//   const isWeb = Platform.OS === 'web';
//   const isMobile = !isWeb;
//   // Adjust breakpoint if needed, 768 is a common tablet breakpoint
//   const showSidebarInline = isWeb && width > 768;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar style="light" /> {/* Changed to light for dark header */}
//       <Header isWeb={isWeb} />
//       <View style={[styles.container, showSidebarInline ? styles.containerWeb : styles.containerMobile]}>
//         {showSidebarInline && (
//           <View style={styles.sidebarContainerWeb}>
//             {/* Wrap Sidebar in ScrollView for web if content might overflow */}
//             <ScrollView>
//               <Sidebar />
//             </ScrollView>
//           </View>
//         )}
//         <View style={styles.mainContentContainer}>
//           {/* For mobile, Sidebar is inside this container but outside ScrollView if it shouldn't scroll with list */}
//           {/* If Sidebar should scroll WITH the list on mobile, move it inside ScrollView */}
//           {!showSidebarInline && isMobile && <Sidebar /> }
//           {/* Wrap SessionList in ScrollView only if SessionList itself isn't scrollable (it is, via FlatList) */}
//           {/* Ensure SessionList takes remaining space */}
//           <SessionList />
//         </View>
//       </View>
//       {isMobile && <BottomTabs />}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//     // SafeAreaView handles top padding on iOS, but might need manual padding for Android status bar if needed
//     // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
//   container: {
//     flex: 1,
//     flexDirection: Platform.select({ web: 'row', default: 'column' }), // Default to column
//   },
//   containerWeb: {
//     flexDirection: 'row',
//   },
//   containerMobile: {
//     flexDirection: 'column',
//   },
//   sidebarContainerWeb: {
//     width: 300,
//     borderRightWidth: 1,
//     borderRightColor: '#ccc',
//     backgroundColor: '#fff', // Match Sidebar background
//     height: '100%', // Ensure it takes full height
//   },
//   mainContentContainer: {
//     flex: 1,
//     padding: Platform.select({ web: 20, default: 10 }),
//     backgroundColor: '#f0f0f0', // Background for the content area
//   },
//   // Remove placeholder styles if they exist
// }); 

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  useWindowDimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import components
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar';
import SessionList from './src/components/SessionList'; // This is our 'Stats' screen content
import BottomTabs from './src/components/BottomTabs';
import MobileFilters from './src/components/MobileFilters';
import MurliScreen from './src/components/MurliScreen'; // Import new screen
import EventsScreen from './src/components/EventsScreen'; // Import new screen
import { ExampleComponent } from './src/components/ExampleComponent'; // <-- Import ExampleComponent

// MSW Native Setup (Import AFTER other imports)
// Only run this setup in development mode AND not in a test environment
/* --- Commenting out Native MSW setup for Expo Go compatibility ---
if (__DEV__ && Platform.OS !== 'web' && process.env.NODE_ENV !== 'test') {
  // Import synchronously requires Metro configuration,
  // dynamically importing avoids this complexity for now.
  import('./mocks/native').then(({ nativeServer }) => {
    // Check if running and start if not (handles Fast Refresh)
    if (typeof nativeServer.listen === 'function') { // Use listen as a proxy check
        try {
           nativeServer.listen({ onUnhandledRequest: 'bypass' });
           console.log('[MSW Native] Server started.');
        } catch (e) {
          // Ignore errors if server is already running (common with Fast Refresh)
          // You might want more specific error checking here depending on MSW's behavior
          if (!e.message.includes('already running')) { // Example check
             console.warn('[MSW Native] Server potentially already running or failed to start:', e.message);
          }
        }
    } else {
      console.warn('[MSW Native] nativeServer object structure unexpected. Could not start.');
    }
  }).catch(error => {
    console.error('[MSW Native] Failed to load or start server:', error);
  });
}
*/

// Define screen names as constants
const SCREENS = {
  STATS: 'Stats',
  MURLI: 'Murlis',
  EVENTS: 'Events',
  HOME: 'Home',
  USERS: 'Users',
};

export default function App() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb;
  const showSidebarInline = isWeb && width > 768;

  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  // Add state for active screen
  const [activeScreen, setActiveScreen] = useState(SCREENS.STATS); 

  // Function to render the correct screen based on activeScreen state
  const renderActiveScreen = () => {
    console.log('--- RENDER ACTIVE SCREEN CALLED ---');
    console.log('[App] Rendering screen:', activeScreen);
    switch (activeScreen) {
      case SCREENS.STATS:
        console.log('[App] Rendering STATS screen content');
        return (
          <ScrollView>
            <ExampleComponent /> {/* <-- Add ExampleComponent here for testing */}
            <SessionList setMobileFiltersVisible={setMobileFiltersVisible} />
          </ScrollView>
        );
      case SCREENS.MURLI:
        console.log('[App] Rendering MURLI screen content');
        return <MurliScreen />;
      case SCREENS.EVENTS:
        console.log('[App] Rendering EVENTS screen content');
        return <EventsScreen />;
      // Add cases for HOME, USERS later if needed
      default:
        console.log('[App] Rendering default screen content (STATS)');
        return (
          <ScrollView>
             <ExampleComponent /> {/* <-- Add ExampleComponent here for testing */}
            <SessionList setMobileFiltersVisible={setMobileFiltersVisible} />
           </ScrollView>
         );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {/* Pass activeScreen state and setter to Header */}
      <Header 
        isWeb={isWeb} 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
      />
      <View style={[styles.container, showSidebarInline ? styles.containerWeb : styles.containerMobile]}>
        {/* Web Sidebar */}
        {showSidebarInline && (
          <View style={styles.sidebarContainerWeb}>
            <ScrollView>
              <Sidebar />
            </ScrollView>
          </View>
        )}
        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Render the active screen using the function */} 
          {renderActiveScreen()}
        </View>
      </View>
      {/* Pass activeScreen state and setter to BottomTabs */}
      {isMobile && 
        <BottomTabs 
          activeScreen={activeScreen} 
          setActiveScreen={setActiveScreen} 
        />}
      {/* Mobile Filters Overlay */}
      {isMobile && mobileFiltersVisible && (
        <MobileFilters onClose={() => setMobileFiltersVisible(false)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    flexDirection: Platform.select({ web: 'row', default: 'column' }),
  },
  containerWeb: {
    flexDirection: 'row',
  },
  containerMobile: {
    flexDirection: 'column',
  },
  sidebarContainerWeb: {
    width: 300,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    backgroundColor: '#fff',
    height: '100%',
  },
  mainContentContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
