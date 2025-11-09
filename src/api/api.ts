import { mockSubscriptions } from "../mock/mock-data";
import type { Subscription } from "../types/types";

export async function fetchSubscriptionsApi(): Promise<Subscription[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [...mockSubscriptions];
}