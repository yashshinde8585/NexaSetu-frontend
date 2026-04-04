import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state and is disabled when isLoading is true', () => {
    render(<Button isLoading={true}>Click Me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when isDisabled prop is true', () => {
    render(<Button isDisabled={true}>Click Me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="error">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-status-error');
  });
});
