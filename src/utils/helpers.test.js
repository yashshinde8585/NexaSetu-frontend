import { describe, it, expect } from 'vitest';
import { getInitials, getProgressTheme } from './helpers';

describe('helpers.js unit tests', () => {
  describe('getInitials', () => {
    it('should return ?? for empty input', () => {
      expect(getInitials('')).toBe('??');
    });

    it('should extract first and last initials', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should handle single name case', () => {
      expect(getInitials('Yash')).toBe('YA');
    });

    it('should handle middle names by taking only first and last', () => {
      expect(getInitials('Yash Mohan Shinde')).toBe('YS');
    });
  });

  describe('getProgressTheme', () => {
    it('should return success for 100', () => {
      expect(getProgressTheme(100)).toBe('success');
    });

    it('should return warning for 50', () => {
      expect(getProgressTheme(50)).toBe('warning');
    });

    it('should return info for 25', () => {
      expect(getProgressTheme(25)).toBe('info');
    });

    it('should return neutral for 0', () => {
      expect(getProgressTheme(0)).toBe('neutral');
    });
  });
});
