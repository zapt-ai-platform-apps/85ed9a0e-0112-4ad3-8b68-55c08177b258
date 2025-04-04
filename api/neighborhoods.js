import { getDbClient } from './_db.js';
import { bars } from '../drizzle/schema.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  try {
    console.log('Neighborhoods API called with method:', req.method);
    
    if (req.method === 'GET') {
      const db = getDbClient();
      
      // Get distinct neighborhoods
      const neighborhoods = await db
        .selectDistinct({ neighborhood: bars.neighborhood })
        .from(bars)
        .orderBy(bars.neighborhood);
      
      // Extract just the names from the results
      const neighborhoodNames = neighborhoods.map(item => item.neighborhood);
      
      res.status(200).json(neighborhoodNames);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in neighborhoods API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}