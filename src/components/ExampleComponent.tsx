import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export const ExampleComponent = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.example.com/message')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.message) {
          setMessage(data.message);
        } else {
          // Handle case where response is ok, but data is missing
          setMessage('No message received');
        }
      })
      .catch(e => {
        console.error("API fetch error:", e);
        setError(e.message || 'Failed to fetch message');
        setMessage('Error loading message'); // Update UI on error
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>API Response:</Text>
      <Text testID="api-message" style={error ? styles.errorText : styles.messageText}>
        {message || 'Loading...'}
      </Text>
      {/* Optionally display the error state */}
      {/* {error && <Text style={styles.errorText}>Error: {error}</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    color: '#333',
  },
  errorText: {
    color: 'red',
  },
}); 