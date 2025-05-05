import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const SessionCard = ({ session }) => {
  // Format the date and time from sessionStartsOn
  const formatDateTime = () => {
    if (!session.sessionStartsOn) return { date: 'N/A', time: 'N/A' };
    
    try {
      const dateTime = new Date(session.sessionStartsOn);
      const date = dateTime.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
      const time = dateTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
      
      return { date, time };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
  };
  
  const { date, time } = formatDateTime();
  
  // Determine status text
  const getStatusText = () => {
    if (session.isCancelled) return 'CANCELLED';
    if (session.hasIssues) return 'ISSUES';
    if (session.isPending) return 'PENDING';
    if (session.isAuto) return 'AUTO';
    return 'MANUAL';
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardInnerContainer}>
        {/* Left side: Date/Time/Status */}
        <View style={styles.leftColumn}>
          <Text style={styles.dateTimeText}>{date}</Text>
          <Text style={styles.dateTimeText}>{time}</Text>
          <TouchableOpacity style={[styles.statusButton, {
            backgroundColor: session.statusColor === 'yellow' ? '#FFC107' : 
                             session.statusColor === 'red' ? '#F44336' : '#2196f3'
          }]}>
            <Text style={styles.statusButtonText}>{getStatusText()}</Text>
          </TouchableOpacity>
        </View>

        {/* Right side: Title, Category, Info */}
        <View style={styles.rightColumn}>
          <Text style={styles.titleText}>{session.eventName}</Text>
          <Text style={styles.categoryText}>
            <Text style={{ color: '#d32f2f' }}>Lang:</Text> {session.langCode}
          </Text>
          <View style={styles.zoomContainer}>
            <Ionicons name="videocam" size={20} color="black" style={styles.videoIcon} />
            <View style={styles.zoomCountBox}>
              <Text style={styles.zoomCountText}>{session.numManualChannels + session.numAutoChannels}</Text>
            </View>
          </View>
          <Text style={styles.zoomLinkText}>
            Session ID: {session.eventSessionId}
          </Text>
        </View>

        {/* Top-right icon */}
        <TouchableOpacity style={styles.topRightIconContainer}>
          <MaterialCommunityIcons name="calendar-clock" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f0f0f0', // Light grey background for the outer area
    marginBottom: 15,
    borderRadius: 8,
    paddingLeft: 10, // Indentation effect
  },
  cardInnerContainer: {
    backgroundColor: '#ffffff', // White inner card
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
    flexDirection: 'row',
    position: 'relative', // Needed for absolute positioning of the icon
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50', // Green left border
  },
  leftColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    width: 100, // Fixed width for alignment
  },
  dateTimeText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  statusButton: {
    backgroundColor: '#2196f3', // Blue button
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginTop: 5,
  },
  statusButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  rightColumn: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  categoryText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  zoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  videoIcon: {
    marginRight: 5,
  },
  zoomCountBox: {
    backgroundColor: '#e0e0e0', // Grey box for count
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    minWidth: 30, // Ensure box has some width
    alignItems: 'center',
  },
  zoomCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  zoomLinkText: {
    fontSize: 12,
    color: '#555',
  },
  topRightIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default SessionCard; 