import React from 'react';
import type { Subscription } from '../../../types/types';
import { useAppDispatch } from '../../../app/hooks';
import { cancelSubscription } from '../subscriptionsSlice';
import { Card, CancelButton } from './SubscriptionsCard.styled.ts';

const formatPrice = (price: number, currency: string): string => {
  if (typeof price !== "number" || isNaN(price)) {
    console.warn("Invalid price:", price);
    return "N/A";
  }

  if (typeof currency !== "string" || currency.trim().length !== 3) {
    console.warn("Invalid currency:", currency);
    return `${price}`;
  }

  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(price);
  } catch (err) {
    console.error("Error formatting price:", err);
    return `${price} ${currency}`;
  }
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `Renews on: ${d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
};

const SubscriptionCard: React.FC<{ subscription: Subscription }> = ({ subscription }) => {
  const dispatch = useAppDispatch();
  const isCancelled = subscription.status === 'cancelled';

  const onCancel = () => {
    if (isCancelled) return;
    dispatch(cancelSubscription({ id: subscription.id }));
  };

  return (
    <Card>
      <h3>{subscription.offerTitle}</h3>
      <div>
        Status: {subscription.status}
      </div>
      <div>
        <strong>Price:</strong> {formatPrice(subscription.price, subscription.currency)}
      </div>
      <div>{formatDate(subscription.nextPaymentDate)}</div>

      <CancelButton
        onClick={onCancel}
        disabled={isCancelled}
      >
        {isCancelled ? 'Cancelled' : 'Cancel'}
      </CancelButton>
    </Card>
  );
};

export default SubscriptionCard;

