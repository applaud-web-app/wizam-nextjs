// /pages/api/stripe/session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    // Fetch the checkout session using the session_id
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent', 'line_items'], // Expand to get additional details
    });

    // Send the session details as the response
    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
