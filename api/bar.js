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
      
      console.log(`Fetching details for bar ID: ${id}`);
      const db = getDbClient();
      
      try {
        // Use BigInt for IDs to avoid potential integer overflow issues
        const barId = parseInt(id, 10);
        
        // Get bar details
        const barDetails = await db.select()
          .from(bars)
          .where(eq(bars.id, barId))
          .limit(1);
        
        if (barDetails.length === 0) {
          console.log(`Bar not found with ID: ${id}`);
          return res.status(404).json({ error: 'Bar not found' });
        }
        
        // Get recent wait times for this bar
        const recentWaitTimes = await db.select({
          id: waitTimes.id,
          waitMinutes: waitTimes.waitMinutes,
          createdAt: waitTimes.createdAt
        })
        .from(waitTimes)
        .where(eq(waitTimes.barId, barId))
        .orderBy(desc(waitTimes.createdAt))
        .limit(10);
        
        const result = {
          ...barDetails[0],
          waitTimes: recentWaitTimes || [] // Ensure waitTimes is always an array
        };
        
        console.log(`Successfully retrieved bar details for ID: ${id}`);
        res.status(200).json(result);
      } catch (dbError) {
        console.error('Database error in bar API:', dbError);
        Sentry.captureException(dbError);
        res.status(500).json({ error: 'Database error', message: dbError.message });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in bar API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}