import { StyleSheet } from 'react-native';

/**
 * Utility functions for testing UI components
 */

// Define app color constants
export const COLORS = {
  PRIMARY: '#d32f2f', // Red primary color
  SECONDARY: '#00a99d', // Teal accent color
  WARNING: '#ffc107', // Yellow warning color
  ERROR: '#d32f2f', // Error color (same as primary)
  TEXT_PRIMARY: '#333',
  TEXT_SECONDARY: '#555',
  BACKGROUND: '#f0f0f0',
};

/**
 * Check if a component uses the correct primary color
 * @param {Object} component - React test component 
 * @param {String} propName - The prop to check (e.g., 'color', 'backgroundColor')
 * @returns {Boolean} - Whether the component uses the primary color
 */
export const checkPrimaryColor = (component, propName) => {
  if (!component || !component.props) return false;
  
  const propValue = getPropValue(component, propName);
  return propValue === COLORS.PRIMARY;
};

/**
 * Get a nested prop value from a component
 * @param {Object} component - React test component
 * @param {String} propPath - Dot notation path to prop (e.g., 'style.backgroundColor')
 * @returns {*} - The prop value
 */
export const getPropValue = (component, propPath) => {
  if (!component || !component.props) return undefined;
  
  const parts = propPath.split('.');
  let current = component.props;
  
  for (const part of parts) {
    if (current[part] === undefined) return undefined;
    current = current[part];
  }
  
  return current;
};

/**
 * Verify the positioning of elements in a layout
 * @param {Object} container - Container component
 * @param {Array} elements - Array of elements to check
 * @returns {Boolean} - Whether positioning is correct
 */
export const verifyPositioning = (container, elements) => {
  // Implementation would depend on specific layout requirements
  // This is a simplified example
  return elements.every(el => container.contains(el));
};

/**
 * Extract styles from a React Native component
 * @param {Object} component - React test component
 * @returns {Object} - Combined style object
 */
export const getComputedStyle = (component) => {
  if (!component || !component.props || !component.props.style) return {};
  
  const style = component.props.style;
  
  // If array of styles, flatten them
  if (Array.isArray(style)) {
    return StyleSheet.flatten(style);
  }
  
  return style;
};

/**
 * Check if API data has been correctly mapped to component props
 * @param {Object} apiData - API response data
 * @param {Object} component - Rendered component
 * @param {Object} mapping - Mapping of API fields to component props
 * @returns {Boolean} - Whether mapping is correct
 */
export const verifyDataMapping = (apiData, component, mapping) => {
  if (!apiData || !component) return false;
  
  return Object.entries(mapping).every(([apiField, componentProp]) => {
    const apiValue = getNestedValue(apiData, apiField);
    const componentValue = getPropValue(component, componentProp);
    return apiValue === componentValue;
  });
};

/**
 * Get a nested value from an object using dot notation
 * @param {Object} obj - Object to extract from
 * @param {String} path - Dot notation path
 * @returns {*} - Extracted value
 */
const getNestedValue = (obj, path) => {
  if (!obj) return undefined;
  
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current[part] === undefined) return undefined;
    current = current[part];
  }
  
  return current;
}; 