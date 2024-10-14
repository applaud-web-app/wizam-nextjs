import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  // if (req.method !== 'POST') {
  //   return res.status(405).json({ error: 'Method not allowed' });
  // }  

  const { priceId, priceType, customerId } = req.body;

  // Validate input
  // if (!priceId || !priceType || !customerId) {
  //   console.error("Missing required fields:", { priceId, priceType, customerId });
  //   return res.status(400).json({ error: 'Missing required fields' });
  // }

  try {
    // Set the mode based on priceType
    const mode = priceType === 'fixed' ? 'payment' : 'subscription';

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode,
      customer: customerId, // Use the provided customer ID
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/cancel`,
    });

    console.log(res);
    return res.status(200).json({ id: session.id });
  } catch (err) {
    // Improved error handling
    console.log(err);
  }
}
