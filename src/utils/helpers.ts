export const formatUsername = (name: string | null | undefined): string => {
  if (!name) {
    return 'Guest';
  }
  // Example: Capitalize first letter, trim whitespace
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export const add = (a: number, b: number): number => {
  return a + b;
}; 