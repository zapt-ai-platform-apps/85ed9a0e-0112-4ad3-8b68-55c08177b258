import { getDbClient } from './_db.js';
import { bars, waitTimes } from '../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  try {
    console.log('Bar API called with method:', req.method);
    
    if (req.method === 'GET') {
      // Extract query parameters from URL
      const url = new URL(req.url, `http://${req.headers.host}`);
      const id = url.searchParams.get('id');
      
      if (!id) {
        return res.status(400).json({ error: 'Bar ID is required' });
      }
      
      const db = getDbClient();
      
      // Get bar details
      const barDetails = await db.select()
        .from(bars)
        .where(eq(bars.id, Number(id)))
        .limit(1);
      
      if (barDetails.length === 0) {
        return res.status(404).json({ error: 'Bar not found' });
      }
      
      // Get recent wait times for this bar
      const recentWaitTimes = await db.select({
        id: waitTimes.id,
        waitMinutes: waitTimes.waitMinutes,
        createdAt: waitTimes.createdAt
      })
      .from(waitTimes)
      .where(eq(waitTimes.barId, Number(id)))
      .orderBy(desc(waitTimes.createdAt))
      .limit(10);
      
      res.status(200).json({
        ...barDetails[0],
        waitTimes: recentWaitTimes || [] // Ensure waitTimes is always an array
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in bar API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}