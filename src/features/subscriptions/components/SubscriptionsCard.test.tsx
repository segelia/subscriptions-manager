import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import SubscriptionCard from './SubscriptionsCard';
import type { Subscription } from '../../../types/types';
import * as redux from '../../../app/hooks';
import { cancelSubscription } from '../subscriptionsSlice';

describe('SubscriptionCard', () => {
  const sampleSubscription: Subscription = {
    id: 'sub-123',
    offerTitle: 'Premium Plan',
    status: 'active',
    price: 9.99,
    currency: 'USD',
    nextPaymentDate: '2025-12-01',
  };

  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(redux, 'useAppDispatch').mockReturnValue(dispatchMock);
  });

  it('renders subscription details', () => {
    render(<SubscriptionCard subscription={sampleSubscription} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Premium Plan');
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: active');
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText(/Renews on:/)).toBeInTheDocument();
  });

  it('enables cancel button when active', () => {
    render(<SubscriptionCard subscription={sampleSubscription} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeEnabled();
  });

  it('dispatches cancelSubscription on cancel click', () => {
    render(<SubscriptionCard subscription={sampleSubscription} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(dispatchMock).toHaveBeenCalledWith(cancelSubscription({ id: 'sub-123' }));
  });

  it('disables button and shows "Cancelled" when subscription is cancelled', () => {
    render(<SubscriptionCard subscription={{ ...sampleSubscription, status: 'cancelled' }} />);
    const button = screen.getByRole('button', { name: /cancelled/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
