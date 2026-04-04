import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});
