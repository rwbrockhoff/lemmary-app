import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Loaded once & reused so Stripe script isn't fetched on every render
export const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
