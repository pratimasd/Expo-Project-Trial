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

// Import the actual components
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar'; // This is the Web Sidebar now
import SessionList from './src/components/SessionList';
import BottomTabs from './src/components/BottomTabs';
import MobileFilters from './src/components/MobileFilters';

export default function App() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb;
  const showSidebarInline = isWeb && width > 768;

  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <Header isWeb={isWeb} />
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
          <SessionList setMobileFiltersVisible={setMobileFiltersVisible} />
        </View>
      </View>
      {/* Bottom Tabs - Ensure no stray text/whitespace around this conditional render */}
      {isMobile && <BottomTabs />}
      {/* Mobile Filters - Ensure no stray text/whitespace around this conditional render */}
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
    padding: Platform.select({ web: 20, default: 10 }),
    backgroundColor: '#f0f0f0',
  },
});
