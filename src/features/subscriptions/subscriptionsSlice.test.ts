import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../api/api');

import '@testing-library/jest-dom';

beforeEach(async () => {
  vi.resetModules();
});

import {
  subscriptionsReducer,
  initialState as sliceInitialState,
  cancelSubscription,
  fetchSubscriptions,
} from './subscriptionsSlice';
import * as api from '../../api/api';


describe('subscriptions slice (essential)', () => {
  const sampleItems = [
    { id: 'a', offerTitle: 'A', status: 'active', price: 1, currency: 'USD', nextPaymentDate: '2025-01-01' },
    { id: 'b', offerTitle: 'B', status: 'active', price: 2, currency: 'USD', nextPaymentDate: '2025-02-01' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading=true on pending', () => {
    const next = subscriptionsReducer(sliceInitialState, { type: fetchSubscriptions.pending.type });
    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
  });

  it('stores items and clears loading on fulfilled', () => {
    const next = subscriptionsReducer(sliceInitialState, {
      type: fetchSubscriptions.fulfilled.type,
      payload: sampleItems,
    });
    expect(next.loading).toBe(false);
    expect(next.items).toEqual(sampleItems);
    expect(next.error).toBeNull();
  });

  it('sets error on rejected (with payload)', () => {
    const next = subscriptionsReducer(sliceInitialState, {
      type: fetchSubscriptions.rejected.type,
      payload: 'Failed to fetch subscriptions',
    });
    expect(next.loading).toBe(false);
    expect(next.error).toBe('Failed to fetch subscriptions');
  });

  it('cancelSubscription marks a subscription as cancelled when active', () => {
    const state = { ...sliceInitialState, items: [{ id: 'x', status: 'active', offerTitle: 'X', price: 0, currency: 'USD', nextPaymentDate: '2025-01-01' }] };
    const next = subscriptionsReducer(state as any, cancelSubscription({ id: 'x' }));
    expect(next.items[0].status).toBe('cancelled');
  });

  it('cancelSubscription does nothing when subscription already cancelled', () => {
    const state = { ...sliceInitialState, items: [{ id: 'x', status: 'cancelled', offerTitle: 'X', price: 0, currency: 'USD', nextPaymentDate: '2025-01-01' }] };
    const next = subscriptionsReducer(state as any, cancelSubscription({ id: 'x' }));
    expect(next.items[0].status).toBe('cancelled');
  });

  it('thunk: dispatches pending and fulfilled when api resolves', async () => {
    vi.spyOn(api, 'fetchSubscriptionsApi').mockResolvedValueOnce(sampleItems);

    const dispatch = vi.fn();
    const getState = vi.fn();

    await fetchSubscriptions()(dispatch, getState, undefined);

    expect(api.fetchSubscriptionsApi).toHaveBeenCalled();

    const types = dispatch.mock.calls.map((c) => c[0].type);
    expect(types.some((t: string) => t.endsWith('/pending'))).toBe(true);
    expect(types.some((t: string) => t.endsWith('/fulfilled'))).toBe(true);

    const fulfilledAction = dispatch.mock.calls.map((c) => c[0]).find((a: any) => a.type.endsWith('/fulfilled'));
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction.payload).toEqual(sampleItems);
  });

  it('thunk: dispatches rejected with correct payload when api throws', async () => {
    vi.spyOn(api, 'fetchSubscriptionsApi').mockRejectedValueOnce(new Error('uh oh'));

    const dispatch = vi.fn();
    const getState = vi.fn();

    await fetchSubscriptions()(dispatch, getState, undefined);

    expect(api.fetchSubscriptionsApi).toHaveBeenCalled();

    const rejectedAction = dispatch.mock.calls.map((c) => c[0]).find((a: any) => a.type.endsWith('/rejected'));
    expect(rejectedAction).toBeDefined();
    expect(rejectedAction.payload).toBe('Failed to fetch subscriptions');
  });
});
