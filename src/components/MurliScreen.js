import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Platform, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for murlis based on the screenshot
const murliData = [
  {
    id: '1',
    title: 'Hindi Murli',
    time: '11:00',
    recurring: true,
    days: ['Tue'],
  },
  {
    id: '2',
    title: 'English Murli',
    time: '18:00',
    recurring: true,
    days: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
  },
  {
    id: '3',
    title: 'English Murli',
    time: '21:53',
    recurring: true,
    days: ['Wed', 'Fri'],
  },
];

// Calendar data (mock)
const calendarData = {
  month: 'June 2024',
  days: [
    ['', '', '', '', '', '', '1'],
    ['2', '3', '4', '5', '6', '7', '8'],
    ['9', '10', '11', '12', '13', '14', '15'],
    ['16', '17', '18', '19', '20', '21', '22'],
    ['23', '24', '25', '26', '27', '28', '29'],
    ['30', '1', '2', '3', '4', '5', '6'],
  ],
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: '30',
};

// Helper function to map API data to component format
const mapApiDataToMurliFormat = (apiData) => {
  if (!apiData || !apiData.results) return [];
  
  return apiData.results.map(item => ({
    id: item.eventId.toString(),
    title: item.eventName,
    time: item.sessionStartTime,
    recurring: item.recurringCode === 'W',
    days: item.recurringDays ? item.recurringDays.split(',').map(day => day.trim()).filter(day => day) : [],
    langCode: item.langCode,
    hasIssue: item.hasIssue,
    isPending: item.isPending,
    statusColor: item.statusColor
  }));
};

const MurliCard = ({ murli }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{murli.time}</Text>
      </View>
      
      <View style={styles.contentColumn}>
        <View style={[styles.murliCard, murli.statusColor ? {borderLeftColor: murli.statusColor === 'yellow' ? '#ffc107' : '#d32f2f'} : {}]}>
          <View style={styles.cardHeader}>
            <Text style={styles.murliTitle}>{murli.title}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#d32f2f" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.recurringContainer}>
            <Text style={styles.recurringText}>Recurring</Text>
            <Text style={styles.daysText}>{Array.isArray(murli.days) ? murli.days.join(' , ') : murli.days}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Calendar component based on screenshot
const Calendar = () => {
  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarMonth}>{calendarData.month}</Text>
        <View style={styles.calendarControls}>
          <TouchableOpacity style={styles.calendarButton}>
            <Ionicons name="chevron-back" size={18} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.calendarButton}>
            <Ionicons name="chevron-forward" size={18} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Weekday headers */}
      <View style={styles.weekdayHeader}>
        {calendarData.weekdays.map((day, index) => (
          <Text key={`weekday-${index}`} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>
      
      {/* Calendar days */}
      {calendarData.days.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {week.map((day, dayIndex) => (
            <TouchableOpacity 
              key={`day-${weekIndex}-${dayIndex}`} 
              style={[
                styles.dayCell,
                day === calendarData.today && styles.todayCell,
                day === '' && styles.emptyCell
              ]}
            >
              <Text style={[
                styles.dayText,
                day === calendarData.today && styles.todayText
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

// Sidebar Filters component
const SidebarFilters = () => {
  return (
    <View style={styles.sidebarFilters}>
      {/* Categories section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Categories</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioOption}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner}></View>
            </View>
            <Text style={styles.radioLabel}>Preferred</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.radioOption}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner}></View>
            </View>
            <Text style={styles.radioLabel}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.radioOption}>
            <View style={[styles.radioButton, styles.radioButtonSelected]}>
              <View style={styles.radioInnerSelected}></View>
            </View>
            <Text style={styles.radioLabel}>Murli</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Status section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Status</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioOption}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner}></View>
            </View>
            <Text style={styles.radioLabel}>With Issues (Manual)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.radioOption}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner}></View>
            </View>
            <Text style={styles.radioLabel}>With Issues (Intg)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.radioOption}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner}></View>
            </View>
            <Text style={styles.radioLabel}>Cancelled</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Content Filters component
const ContentFilters = () => {
  return (
    <View style={styles.contentFiltersContainer}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>
      
      {/* Language filters */}
      <View style={styles.languageFilters}>
        <Text style={styles.filterLabel}>Language</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioOption}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner}></View>
            </View>
            <Text style={styles.radioLabel}>Preferred</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.radioOption}>
            <View style={[styles.radioButton, styles.radioButtonSelected]}>
              <View style={styles.radioInnerSelected}></View>
            </View>
            <Text style={styles.radioLabel}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.radioOption}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner}></View>
            </View>
            <Text style={styles.radioLabel}>English</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Status filters */}
      <View style={styles.statusFilters}>
        <Text style={styles.filterLabel}>Status</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioOption}>
            <View style={[styles.radioButton, styles.radioButtonSelected]}>
              <View style={styles.radioInnerSelected}></View>
            </View>
            <Text style={styles.radioLabel}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.radioOption}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner}></View>
            </View>
            <Text style={styles.radioLabel}>Pending</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.radioOption}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner}></View>
            </View>
            <Text style={styles.radioLabel}>With Issues</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const MurliScreen = ({ useApi = true }) => {
  const isMobile = Platform.OS !== 'web';
  const [filterVisible, setFilterVisible] = useState(false);
  const [murlis, setMurlis] = useState([]);  // Initialize with empty array
  const [loading, setLoading] = useState(true);  // Start with loading true
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Call API when component mounts (not dependent on useApi prop)
    fetchMurlis();
  }, []);

  const fetchMurlis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/events?cid=44&isMurli=true&subcatId=1&langCode=-1&pageNum=1&pageSize=10&status=0&contains=',
        {
          method: 'GET',
          headers: {
            'x-appery-api-express-api-key': '7ec55934-696a-485b-8770-4ad8dc7c40f1',
            'x-appery-session-token': 'b84fd727-6292-4e7e-8e1d-5341437db663',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const formattedData = mapApiDataToMurliFormat(data);
      setMurlis(formattedData);
      setTotalCount(data.header.found || formattedData.length);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch murlis:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderMurli = ({ item }) => <MurliCard murli={item} />;

  // Render loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text style={styles.loadingText}>Loading murlis...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={40} color="#d32f2f" />
        <Text style={styles.errorText}>Failed to load murlis</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMurlis}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Left Column - Calendar for Web */}
        {Platform.OS === 'web' && (
          <View style={styles.leftColumn}>
            <ScrollView style={styles.leftScrollView}>
              <Calendar />
              {/* SidebarFilters removed to eliminate duplication */}
            </ScrollView>
          </View>
        )}

        {/* Right Column - Content */}
        <View style={styles.rightColumn}>
          {/* Murli Results Header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              Showing results for: <Text style={styles.resultsCount}>{totalCount} murlis</Text>
            </Text>
          </View>

          {/* Content Filters */}
          <ContentFilters />
          
          {/* Murlis List */}
          <View style={styles.murliListContainer}>
            <FlatList
              data={murlis}
              renderItem={renderMurli}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContentContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No murlis found</Text>
                </View>
              }
            />
          </View>
        </View>
      </View>

      {/* Floating action button for adding new murli */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
  },
  leftColumn: {
    width: 300,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    backgroundColor: 'white',
  },
  leftScrollView: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#d32f2f',
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Calendar styles
  calendarContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  calendarControls: {
    flexDirection: 'row',
  },
  calendarButton: {
    padding: 5,
  },
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayCell: {
    flex: 1,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCell: {
    backgroundColor: '#d32f2f',
    borderRadius: 15,
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Sidebar filters styles
  sidebarFilters: {
    padding: 10,
    backgroundColor: 'white',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  
  // Content filters styles
  contentFiltersContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageFilters: {
    marginBottom: 15,
  },
  statusFilters: {
    marginBottom: 5,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
  // Radio button styles
  radioGroup: {
    marginLeft: 10,
    flexDirection: Platform.OS === 'web' ? 'column' : 'row',
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 15,
    minWidth: 100,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: '#d32f2f',
  },
  radioInner: {
    width: 0,
    height: 0,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  radioInnerSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d32f2f',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  
  // Results header styles
  resultsHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultsText: {
    fontSize: 14,
    color: '#555',
  },
  resultsCount: {
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  
  // Murli list styles
  murliListContainer: {
    flex: 1,
  },
  listContentContainer: {
    padding: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timeColumn: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontWeight: 'bold',
    color: '#555',
  },
  contentColumn: {
    flex: 1,
  },
  murliCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  murliTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 5,
  },
  recurringContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recurringText: {
    color: '#d32f2f',
    marginRight: 10,
    fontSize: 13,
  },
  daysText: {
    color: '#555',
    fontSize: 13,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00a99d',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  }
});

export default MurliScreen; 