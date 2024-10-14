import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import cookie from 'cookie'; // Use this to parse cookies

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

// Mock function to find a user in your database
const findUserByToken = (token: string) => {
  // Mock user data. Replace this with your actual user fetching logic
  return { id: 'user_123', customer_id: null }; // null means the user doesn't have a customer_id yet
};

// Mock function to save a customer ID in your database
const saveCustomerIdToUser = (userId: string, customerId: string) => {
  // Replace this with actual logic to save customerId to your database
  console.log(`Saving customerId ${customerId} for userId ${userId}`);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { priceId, priceType } = req.body;

  // Extract the cookies from the request
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.jwt; // Assuming the JWT is stored in a cookie named `jwtToken`

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized, no token found' });
  }

  // Fetch the user by token (this is mocked, replace with your actual logic)
  const user = findUserByToken(token);

  try {
    // Initialize customerId as either a string or null
    let customerId: string | null = user.customer_id;

    // If no customer ID, create a new customer in Stripe
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: "user@example.com", // Provide the email address (you may extract it from your token or database)
        metadata: { userId: user.id },
      });

      customerId = customer.id;

      // Save the customerId in your database
      saveCustomerIdToUser(user.id, customerId);
    }

    // Determine session mode based on priceType
    const mode = priceType === 'fixed' ? 'payment' : 'subscription';

    // Create a checkout session and attach the customer ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode,
      customer: customerId, // Attach the customer ID to the session
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/cancel`,
    });

    // Return the session ID to the client
    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error((err as Error).message); // Cast to Error to access `message`
    return res.status(500).json({ error: (err as Error).message });
  }
}
