import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

import SubscriptionsList from './SubscriptionsList';
import * as redux from '../../../app/hooks';
import * as slice from '../subscriptionsSlice';

vi.mock('./SubscriptionsCard', () => {
  return {
    __esModule: true,
    default: ({ subscription }: { subscription: any }) => (
      <div data-testid="subscription-card">{subscription.offerTitle}</div>
    ),
  };
});

describe('SubscriptionsList (essential tests)', () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(redux, 'useAppDispatch').mockReturnValue(dispatchMock);
  });

  it('dispatches fetchSubscriptions on mount', () => {
    const fakeAction = { type: 'subscriptions/fetch' };
    vi.spyOn(slice, 'fetchSubscriptions').mockReturnValue(fakeAction as any);

    vi.spyOn(redux, 'useAppSelector').mockImplementation(() => ({
      items: [],
      loading: false,
      error: null,
    }) as any);

    render(<SubscriptionsList />);
    expect(dispatchMock).toHaveBeenCalledWith(fakeAction);
  });

  it('renders loading state when loading is true', () => {
    vi.spyOn(slice, 'fetchSubscriptions').mockReturnValue({ type: 'noop' } as any);
    vi.spyOn(redux, 'useAppSelector').mockImplementation(() => ({
      items: [],
      loading: true,
      error: null,
    }) as any);

    render(<SubscriptionsList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    vi.spyOn(slice, 'fetchSubscriptions').mockReturnValue({ type: 'noop' } as any);
    vi.spyOn(redux, 'useAppSelector').mockImplementation(() => ({
      items: [],
      loading: false,
      error: 'Network failure',
    }) as any);

    render(<SubscriptionsList />);
    expect(screen.getByText(/Error: Network failure/)).toBeInTheDocument();
  });

  it('renders empty message when no items', () => {
    vi.spyOn(slice, 'fetchSubscriptions').mockReturnValue({ type: 'noop' } as any);
    vi.spyOn(redux, 'useAppSelector').mockImplementation(() => ({
      items: [],
      loading: false,
      error: null,
    }) as any);

    render(<SubscriptionsList />);
    expect(screen.getByText('No subscriptions found.')).toBeInTheDocument();
  });

  it('renders a SubscriptionCard for each item', () => {
    vi.spyOn(slice, 'fetchSubscriptions').mockReturnValue({ type: 'noop' } as any);
    const items = [
      { id: '1', offerTitle: 'A' },
      { id: '2', offerTitle: 'B' },
      { id: '3', offerTitle: 'C' },
    ];
    vi.spyOn(redux, 'useAppSelector').mockImplementation(() => ({
      items,
      loading: false,
      error: null,
    }) as any);

    render(<SubscriptionsList />);
    const cards = screen.getAllByTestId('subscription-card');
    expect(cards).toHaveLength(items.length);
    expect(cards.map((c) => c.textContent)).toEqual(['A', 'B', 'C']);
  });
});
