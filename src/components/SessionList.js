import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import SessionCard from './SessionCard';
import { sessions } from '../data/mockData';

const SessionList = () => {
  const renderItem = ({ item }) => <SessionCard session={item} />;

  return (
    <View style={styles.container}>
      {/* Header Section: Showing results and filter tags */}
      <View style={styles.listHeaderContainer}>
        <Text style={styles.resultsText}>
          Showing results for: <Text style={styles.resultsCount}>4073 Sessions</Text>
        </Text>
        <View style={styles.filterTagsContainer}>
          <View style={styles.filterTag}>
            <Text style={styles.filterTagText}>30 Jun 2024</Text>
          </View>
          <View style={styles.filterTag}>
            <Text style={styles.filterTagText}>Murli</Text>
          </View>
          <View style={styles.filterTag}>
            <Text style={styles.filterTagText}>Tamil</Text>
          </View>
        </View>
      </View>

      {/* List of Sessions */}
      <FlatList
        data={sessions} // Use hardcoded data
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listHeaderContainer: {
    marginBottom: 15,
    paddingHorizontal: 5, // Align with card indentation slightly
  },
  resultsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  resultsCount: {
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  filterTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow tags to wrap on smaller screens
  },
  filterTag: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d32f2f', // Red border
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  filterTagText: {
    color: '#d32f2f', // Red text
    fontSize: 12,
  },
  listContentContainer: {
    paddingBottom: 20, // Add padding at the bottom of the list
  },
});

export default SessionList; 