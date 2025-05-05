import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import SessionCard from './SessionCard';
// Remove the direct import of sessions data
// import { sessions } from '../data/mockData';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/sessions/stats?cid=44&filterDt=2025-04-30&subcatId=-1&status=0&contains=&langCode=-1&pageNum=2&pageSize=10&lastSessionId=335785', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-appery-api-express-api-key': '7ec55934-696a-485b-8770-4ad8dc7c40f1',
          'x-appery-session-token': 'b84fd727-6292-4e7e-8e1d-5341437db663',
          // Add any other required headers here
        }
      });
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Invalid response format');
      }
      
      // Check if response has the expected structure
      if (responseData.results) {
        setSessions(responseData.results);
      } else {
        // Handle unexpected response structure
        console.error('Unexpected API response structure:', responseData);
        setSessions([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions');
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => <SessionCard session={item} />;

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#d32f2f" testID="loading-indicator" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section: Showing results and filter tags */}
      <View style={styles.listHeaderContainer}>
        <Text style={styles.resultsText}>
          Showing results for: <Text style={styles.resultsCount}>{sessions.length} Sessions</Text>
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
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.eventSessionId.toString()}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
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