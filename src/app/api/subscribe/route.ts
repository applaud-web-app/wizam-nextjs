import type { NextApiRequest, NextApiResponse } from 'next';

const MAILCHIMP_API_URL = `https://<dc>.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;

export default async function subscribe(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email || !email.length) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    try {
      const response = await fetch(MAILCHIMP_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed', // "pending" for double opt-in
        }),
      });

      if (response.status >= 400) {
        return res.status(400).json({
          error: `There was an error subscribing to the newsletter. Please try again.`,
        });
      }

      return res.status(201).json({ message: 'Successfully subscribed!' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
