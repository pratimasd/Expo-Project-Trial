import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Same nav items as Header, could potentially be shared from a constants file
const NAV_ITEMS = [
  { name: 'Home', icon: 'home' },
  { name: 'Murlis', icon: 'menu-book' },
  { name: 'Events', icon: 'event' },
  { name: 'Stats', icon: 'bar-chart' },
  { name: 'Users', icon: 'people' },
];

const BottomTabs = () => {
  const [activeTab, setActiveTab] = React.useState('Stats'); // Default to Stats

  return (
    <View style={styles.tabBarContainer}>
      {NAV_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.tabItem}
          onPress={() => setActiveTab(item.name)}
        >
          <MaterialIcons
            name={item.icon}
            size={24} // Slightly larger icons for touch targets
            color={activeTab === item.name ? 'white' : '#f8bbd0'} // Active: white, Inactive: lighter red/pink
          />
          <Text style={[styles.tabLabel, activeTab === item.name && styles.activeTabLabel]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 65, // Slightly taller for better touch
    backgroundColor: '#d32f2f',
    borderTopWidth: 1,
    borderTopColor: '#b71c1c',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5, // Add padding at the bottom if needed for safe areas
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  tabLabel: {
    fontSize: 10,
    color: '#f8bbd0', // Lighter red/pink for inactive
    marginTop: 4,
  },
  activeTabLabel: {
    color: 'white', // White for active
    fontWeight: 'bold',
  },
});

export default BottomTabs; 