import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MagicBar from './MagicBar';
import MagicService from '../../api/magicApi';
import { useAuth } from '../../context/AuthContext';
import { useMagicState, useMagicActions } from '../../context/MagicContext';

// Mock dependencies
vi.mock('../../api/magicApi');
vi.mock('../../context/AuthContext');
vi.mock('../../context/MagicContext');

describe('MagicBar Component', () => {
  const mockSetGlobalResult = vi.fn();
  const mockSetPendingCommand = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup Auth mock
    useAuth.mockReturnValue({
      user: { role: 'ADMIN', name: 'Test Admin' },
    });

    // Setup Magic mocks
    useMagicState.mockReturnValue({
      pendingCommand: null,
      activeProjects: [
        { _id: '1', name: 'Project Alpha', healthScore: 85, percentage: 70 },
      ],
      dashboardContext: { stats: { totalTasks: 10 } },
    });

    useMagicActions.mockReturnValue({
      setGlobalResult: mockSetGlobalResult,
      setPendingCommand: mockSetPendingCommand,
    });

    // Mock MagicService implementation
    MagicService.executeCommand.mockResolvedValue({
      data: { message: 'Command executed successfully', actions: [] },
    });
  });

  it('renders the MagicBar input correctly', () => {
    render(<MagicBar />);
    expect(screen.getByPlaceholderText(/Ask Nexa/i)).toBeInTheDocument();
  });

  it('calls MagicService.executeCommand when a command is submitted', async () => {
    render(<MagicBar />);

    const input = screen.getByPlaceholderText(/Ask Nexa/i);
    const form = screen.getByRole('textbox').closest('form');

    fireEvent.change(input, { target: { value: 'Show project health' } });
    fireEvent.submit(form);

    expect(MagicService.executeCommand).toHaveBeenCalledWith(
      'Show project health',
      expect.objectContaining({
        visibleProjects: expect.arrayContaining([
          expect.objectContaining({ name: 'Project Alpha' }),
        ]),
      })
    );

    await waitFor(() => {
      expect(mockSetGlobalResult).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Command executed successfully' })
      );
    });
  });

  it('shows loading state while processing a command', async () => {
    // Make the service call hang intentionally
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    MagicService.executeCommand.mockReturnValue(promise);

    render(<MagicBar />);

    const input = screen.getByPlaceholderText(/Ask Nexa/i);
    fireEvent.change(input, { target: { value: 'Analyze risks' } });
    fireEvent.submit(input.closest('form'));

    // Verify input is disabled and spinner is shown
    expect(input).toBeDisabled();

    // Resolve the promise to clean up and wait for the component to handle the result
    await act(async () => {
      resolvePromise({ data: { message: 'done' } });
    });

    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });

  it('clears query after successful command execution', async () => {
    render(<MagicBar />);

    const input = screen.getByPlaceholderText(/Ask Nexa/i);
    fireEvent.change(input, { target: { value: 'Clean workspace' } });
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('handles API errors gracefully', async () => {
    MagicService.executeCommand.mockRejectedValue(new Error('Network Error'));

    render(<MagicBar />);

    const input = screen.getByPlaceholderText(/Ask Nexa/i);
    fireEvent.change(input, { target: { value: 'Break it' } });
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(mockSetGlobalResult).toHaveBeenCalledWith(null);
      expect(mockSetGlobalResult).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'System offline. Command execution failed.',
        })
      );
    });
  });
});
