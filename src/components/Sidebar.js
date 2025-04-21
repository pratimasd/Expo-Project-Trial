import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calendarData, filters } from '../data/mockData';

// Simple Radio Button Component
const RadioButton = ({ label, selected, onPress }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

const Calendar = () => {
  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarMonth}>{calendarData.month}</Text>
        <View style={styles.calendarNav}>
          <Ionicons name="calendar-outline" size={20} color="#666" style={{ marginRight: 10 }} />
          <Ionicons name="chevron-back" size={20} color="#666" style={{ marginRight: 10 }} />
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </View>
      <View style={styles.calendarGrid}>
        <View style={styles.calendarWeekdays}>
          {calendarData.weekdays.map((day) => (
            <Text key={day} style={styles.calendarWeekday}>{day}</Text>
          ))}
        </View>
        {calendarData.days.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((day, dayIndex) => (
              <View key={dayIndex} style={styles.calendarDayContainer}>
                <Text
                  style={[
                    styles.calendarDay,
                    day === calendarData.today && styles.calendarDayToday, // Highlight today
                    (weekIndex === 0 && day > 20) || (weekIndex > 3 && day < 10) ? styles.calendarDayOtherMonth : null, // Grey out other month days (approximate logic)
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const FilterGroup = ({ title, options, selectedOption, onSelect }) => (
  <View style={styles.filterGroup}>
    <Text style={styles.filterTitle}>{title}</Text>
    {options.map((option) => (
      <RadioButton
        key={option}
        label={option}
        selected={selectedOption === option}
        onPress={() => onSelect(option)}
      />
    ))}
  </View>
);

const Sidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState('Murli');
  const [selectedStatus, setSelectedStatus] = useState(null); // Example: no default selection
  const [selectedLanguage, setSelectedLanguage] = useState('Tamil');

  return (
    <ScrollView style={styles.sidebarContainer}>
      <Calendar />
      <FilterGroup
        title="Categories"
        options={filters.categories}
        selectedOption={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <FilterGroup
        title="Status" // Assuming title based on content
        options={filters.status}
        selectedOption={selectedStatus}
        onSelect={setSelectedStatus}
      />
      <FilterGroup
        title="Language" // Assuming title based on content
        options={filters.languages}
        selectedOption={selectedLanguage}
        onSelect={setSelectedLanguage}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    padding: 10,
    backgroundColor: '#fff', // White background for sidebar content
  },
  // Calendar Styles
  calendarContainer: {
    backgroundColor: '#f9f9f9', // Light grey background for calendar card
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarMonth: {
    fontWeight: 'bold',
    color: '#d32f2f', // Red month text
    fontSize: 16,
  },
  calendarNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarGrid: {},
  calendarWeekdays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  calendarWeekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  calendarDayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  calendarDay: {
    textAlign: 'center',
    fontSize: 13,
    color: '#333',
  },
  calendarDayToday: {
    backgroundColor: '#d32f2f',
    color: 'white',
    borderRadius: 15, // Make it circular
    width: 26,
    height: 26,
    textAlignVertical: 'center', // Center text vertically
    overflow: 'hidden', // Ensure background stays within circle
    fontWeight: 'bold',
  },
  calendarDayOtherMonth: {
    color: '#ccc',
  },
  // Filter Styles
  filterGroup: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#d32f2f', // Red title
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#d32f2f',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#d32f2f',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
});

export default Sidebar; 