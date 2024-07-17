import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import clientPromise from '../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('cryptoTracker');

    // Fetch data from CoinGecko API
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`
    );

    const symbolData = response.data[symbol as string];

    if (!symbolData || !symbolData.usd) {
      return res.status(404).json({ error: 'Symbol not found or no price data available' });
    }

    const price = symbolData.usd;

    // Store data in MongoDB
    await db.collection('prices').insertOne({
      symbol,
      price,
      timestamp: new Date(),
    });

    // Fetch last 20 entries
    const latestData = await db
      .collection('prices')
      .find({ symbol })
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    res.status(200).json(latestData);
  } catch (error) {
    console.error('Error fetching or storing data:', error);
    res.status(500).json({ error: 'Error fetching or storing data' });
  }
}
