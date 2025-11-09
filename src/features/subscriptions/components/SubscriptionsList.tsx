import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSubscriptions } from '../subscriptionsSlice';
import SubscriptionCard from './SubscriptionsCard';
import type { Subscription } from '../../../types/types';
import { SubscriptionsGrid, MessageWrapper, ErrorWrapper } from './SubscriptionsList.styled';

const SubscriptionsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s: any) => s.subscriptions);

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  if (loading) return <MessageWrapper>Loading...</MessageWrapper>;
  if (error) return <ErrorWrapper>Error: {error}</ErrorWrapper>;
  if (items.length === 0) return <MessageWrapper>No subscriptions found.</MessageWrapper>;

  return (
    <SubscriptionsGrid>
      {items.map((sub: Subscription) => (
        <SubscriptionCard key={sub.id} subscription={sub} />
      ))}
    </SubscriptionsGrid>
  );
};

export default SubscriptionsList;
