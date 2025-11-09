import type { Subscription } from "../types/types";

export const mockSubscriptions: Subscription[] = [
  {
    id: "S12345",
    offerTitle: "Premium Monthly",
    status: "active",
    price: 12.99,
    currency: "USD",
    nextPaymentDate: "2025-11-15T10:00:00Z",
  },
  {
    id: "S67890",
    offerTitle: "Sports Pass - Annual",
    status: "active",
    price: 99.99,
    currency: "USD",
    nextPaymentDate: "2026-08-01T10:00:00Z",
  },
  // one more subscription of my choice
  {
    id: "S27272",
    offerTitle: "Student Plan - Monthly",
    status: "on hold",
    price: 6.99,
    currency: "USD",
    nextPaymentDate: "2028-03-01T10:00:00Z",
  },
];
