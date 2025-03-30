import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WaitTimeBadge from '@/components/common/WaitTimeBadge';

describe('WaitTimeBadge', () => {
  it('renders correctly with low wait time', () => {
    render(<WaitTimeBadge waitMinutes={5} />);
    expect(screen.getByText('5 min wait')).toBeInTheDocument();
    expect(screen.getByText('5 min wait').closest('span')).toHaveClass('wait-time-low');
  });

  it('renders correctly with medium wait time', () => {
    render(<WaitTimeBadge waitMinutes={20} />);
    expect(screen.getByText('20 min wait')).toBeInTheDocument();
    expect(screen.getByText('20 min wait').closest('span')).toHaveClass('wait-time-medium');
  });

  it('renders correctly with high wait time', () => {
    render(<WaitTimeBadge waitMinutes={45} />);
    expect(screen.getByText('45 min wait')).toBeInTheDocument();
    expect(screen.getByText('45 min wait').closest('span')).toHaveClass('wait-time-high');
  });

  it('renders unknown status when wait time is not provided', () => {
    render(<WaitTimeBadge />);
    expect(screen.getByText('Unknown wait')).toBeInTheDocument();
    expect(screen.getByText('Unknown wait').closest('span')).toHaveClass('wait-time-unknown');
  });
});