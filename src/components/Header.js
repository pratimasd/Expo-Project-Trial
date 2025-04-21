import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Using Ionicons for logo/dropdown, MaterialIcons for tabs

const NAV_ITEMS = [
  { name: 'Home', icon: 'home' },
  { name: 'Murlis', icon: 'menu-book' }, // Example icon
  { name: 'Events', icon: 'event' },
  { name: 'Stats', icon: 'bar-chart' },
  { name: 'Users', icon: 'people' },
];

const Header = ({ isWeb }) => {
  const [activeTab, setActiveTab] = React.useState('Stats'); // Default to Stats as per image

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {/* Placeholder for Logo */}
        <Ionicons name="stats-chart" size={24} color="white" style={styles.logoIcon} />
        <Text style={styles.title}>UK STATS</Text>
      </View>

      {isWeb && (
        <View style={styles.navContainer}>
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, activeTab === item.name && styles.activeNavItem]}
              onPress={() => setActiveTab(item.name)}
            >
              <MaterialIcons name={item.icon} size={20} color={activeTab === item.name ? '#d32f2f' : 'white'} />
              <Text style={[styles.navText, activeTab === item.name && styles.activeNavText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.rightContainer}>
        {/* Placeholder for Dropdown */}
        <View style={styles.dropdownPlaceholder}>
          <Text style={styles.dropdownText}>GCH</Text>
          <Ionicons name="caret-down" size={16} color="#d32f2f" />
        </View>
        {/* Placeholder for DEV flag */}
        <View style={styles.devFlag}>
          <Text style={styles.devFlagText}>DEV</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: '#d32f2f',
    paddingHorizontal: Platform.OS === 'web' ? 20 : 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: 8,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navContainer: {
    flexDirection: 'row',
    flex: 1, // Allow nav to take space
    justifyContent: 'center', // Center items
    marginHorizontal: 20, // Add some space around nav
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeNavItem: {
    backgroundColor: 'white',
  },
  navText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#d32f2f',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownPlaceholder: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    marginRight: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  devFlag: {
    backgroundColor: '#b71c1c', // Darker red
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: -5, // Overlap slightly
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    transform: [{ rotate: '45deg' }], // Approximate rotation
    position: 'relative', // Needed for transform?
    top: -10, // Adjust position
    right: -15,
  },
  devFlagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header; 