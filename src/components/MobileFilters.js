import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Simple placeholder for a dropdown
const DropdownPlaceholder = ({ label, value }) => (
  <View style={styles.dropdownContainer}>
    <Text style={styles.dropdownLabel}>{label}</Text>
    <View style={styles.dropdownValueContainer}>
      <Text style={styles.dropdownValue}>{value}</Text>
      <Ionicons name="caret-down" size={16} color="#666" />
    </View>
  </View>
);

const MobileFilters = ({ onClose }) => {
  return (
    // Use SafeAreaView to avoid overlapping status bar/notches
    <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView style={styles.scrollView}>
            {/* Header with Close Button */}
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filters</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close-circle" size={28} color="#d32f2f" />
                </TouchableOpacity>
            </View>

            {/* Date Selector */}
            <View style={styles.dateSelectorContainer}>
                <TouchableOpacity>
                <Ionicons name="chevron-back-circle-outline" size={30} color="#d32f2f" />
                </TouchableOpacity>
                <View style={styles.dateDisplay}>
                    <Text style={styles.dateText}>Sun, 30 Jun 2024</Text>
                    <Ionicons name="calendar" size={20} color="#d32f2f" style={{ marginLeft: 5 }}/>
                </View>
                <TouchableOpacity>
                <Ionicons name="chevron-forward-circle-outline" size={30} color="#d32f2f" />
                </TouchableOpacity>
            </View>

            {/* Category Dropdown */}
            <DropdownPlaceholder label="Category (cat)" value="Murli" />

            {/* Language & Status Row */}
            <View style={styles.row}>
                <View style={styles.column}>
                <DropdownPlaceholder label="Languages" value="Tamil" />
                </View>
                <View style={styles.column}>
                <DropdownPlaceholder label="Status" value="All" />
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                placeholder="Search"
                style={styles.searchInput}
                />
                <Ionicons name="search" size={20} color="#d32f2f" style={styles.searchIcon}/>
            </View>

             {/* Apply/Reset Buttons (Optional) */}
            {/* <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
            </View> */}
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff', // Opaque white background
        zIndex: 10,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Handle Android status bar
    },
    scrollView: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    dateSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 15,
        marginHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    dateDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dateText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    dropdownContainer: {
        marginHorizontal: 10,
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    dropdownLabel: {
        fontSize: 12,
        color: '#d32f2f', // Red label
        marginBottom: 5,
    },
    dropdownValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    dropdownValue: {
        fontSize: 14,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 5, // Adjust spacing between columns
    },
    column: {
        flex: 1,
        marginHorizontal: 5, // Adjust spacing within columns
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 14,
    },
    searchIcon: {
        marginLeft: 5,
    },
    // Optional button styles
    // buttonContainer: {
    //     padding: 15,
    //     borderTopWidth: 1,
    //     borderTopColor: '#eee',
    // },
    // applyButton: {
    //     backgroundColor: '#d32f2f',
    //     padding: 15,
    //     borderRadius: 8,
    //     alignItems: 'center',
    // },
    // applyButtonText: {
    //     color: 'white',
    //     fontWeight: 'bold',
    //     fontSize: 16,
    // },
});

export default MobileFilters; 