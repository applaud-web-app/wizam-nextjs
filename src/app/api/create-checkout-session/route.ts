import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from the environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia'
});

export async function POST(req: Request) {
  try {
    // Parse the incoming request to get the priceId from the frontend
    const { priceId } = await req.json();

    // Ensure that priceId is not empty
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is missing or invalid' }, { status: 400 });
    }

    // Create a Stripe checkout session for a subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Correctly pass the Price ID
          quantity: 1,
        },
      ],
      mode: 'subscription', // or 'payment' for one-time payments
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    // Return the session ID to the frontend
    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    // Log and return error response with appropriate status
    console.error('Stripe error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
