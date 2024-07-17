import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import clientPromise from "../../lib/mongodb";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("stockApp");

    // Fetch data from Alpha Vantage API
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (response.data["Error Message"]) {
      throw new Error(response.data["Error Message"]);
    }

    const timeSeries = response.data["Time Series (5min)"];
    if (!timeSeries) {
      throw new Error("No data available for this symbol");
    }

    const latestData = Object.entries(timeSeries)
      .map(([timestamp, values]: [string, any]) => ({
        timestamp,
        open: values["1. open"],
        high: values["2. high"],
        low: values["3. low"],
        close: values["4. close"],
        volume: values["5. volume"],
      }))
      .slice(0, 20); // Get the latest 20 entries

    // Store data in MongoDB
    await db.collection("stockPrices").insertMany(latestData);

    res.status(200).json(latestData);
  } catch (error: any) {
    console.error("API Error:", error);
    res
      .status(500)
      .json({
        error: error.message || "An error occurred while fetching stock data",
      });
  }
}
