import { formatUsername, add } from './helpers';

describe('Utility Functions', () => {
  // Test suite for formatUsername
  describe('formatUsername', () => {
    it('should return "Guest" for null or undefined input', () => {
      expect(formatUsername(null)).toBe('Guest');
      expect(formatUsername(undefined)).toBe('Guest');
      expect(formatUsername('')).toBe('Guest'); // Assuming empty string is also guest
    });

    it('should capitalize the first letter and trim whitespace', () => {
      expect(formatUsername('  alice ')).toBe('Alice');
      expect(formatUsername('bob')).toBe('Bob');
    });

    it('should handle already capitalized names', () => {
      expect(formatUsername('Charlie')).toBe('Charlie');
    });
  });

  // Test suite for add
  describe('add', () => {
    it('should return the sum of two numbers', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(-1, 5)).toBe(4);
      expect(add(0, 0)).toBe(0);
    });
  });
}); 