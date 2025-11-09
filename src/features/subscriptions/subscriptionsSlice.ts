import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Subscription } from '../../types/types';
import { fetchSubscriptionsApi } from '../../api/api';

interface SubscriptionsState {
  items: Subscription[];
  loading: boolean;
  error: string | null;
}

export const initialState: SubscriptionsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchSubscriptions = createAsyncThunk<
  Subscription[],
  void,
  { rejectValue: string }
>('subscriptions/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchSubscriptionsApi();
    return data;
  } catch (err) {
    return rejectWithValue('Failed to fetch subscriptions');
  }
});

const slice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    cancelSubscription(state, action: PayloadAction<{ id: string }>) {
      const sub = state.items.find((s) => s.id === action.payload.id);
      if (sub && sub.status !== 'cancelled') {
        sub.status = 'cancelled';
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { cancelSubscription } = slice.actions;
export const subscriptionsReducer = slice.reducer;
