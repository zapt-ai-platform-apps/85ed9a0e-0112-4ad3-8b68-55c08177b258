import { getDbClient } from './_db.js';
import { bars, waitTimes } from '../drizzle/schema.js';
import { sql, desc, eq, and, gt, lte } from 'drizzle-orm';
import { subHours } from 'date-fns';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  try {
    console.log('Bars API called with method:', req.method);
    
    if (req.method === 'GET') {
      // Extract query parameters from URL
      const url = new URL(req.url, `http://${req.headers.host}`);
      const neighborhood = url.searchParams.get('neighborhood');
      
      console.log(`Fetching bars with neighborhood filter: ${neighborhood || 'none'}`);
      
      try {
        const db = getDbClient();
        
        // Simpler query approach to avoid potential CockroachDB compatibility issues
        // First get all bars
        let barsQuery = db.select().from(bars);
        if (neighborhood) {
          barsQuery = barsQuery.where(eq(bars.neighborhood, neighborhood));
        }
        
        const allBars = await barsQuery;
        console.log(`Retrieved ${allBars.length} bars from database`);
        
        if (allBars.length === 0) {
          return res.status(200).json([]);
        }
        
        // Then get recent wait times for these bars
        const fourHoursAgo = subHours(new Date(), 4);
        const recentWaitTimes = await db.select({
          barId: waitTimes.barId,
          waitMinutes: waitTimes.waitMinutes,
          createdAt: waitTimes.createdAt
        })
        .from(waitTimes)
        .where(
          and(
            gt(waitTimes.createdAt, fourHoursAgo),
            // Only include wait times for bars we already retrieved
            waitTimes.barId.in(allBars.map(bar => bar.id))
          )
        )
        .orderBy(desc(waitTimes.createdAt));
        
        console.log(`Retrieved ${recentWaitTimes.length} recent wait times`);
        
        // Group wait times by bar
        const waitTimesByBar = {};
        recentWaitTimes.forEach(waitTime => {
          if (!waitTimesByBar[waitTime.barId]) {
            waitTimesByBar[waitTime.barId] = [];
          }
          waitTimesByBar[waitTime.barId].push(waitTime);
        });
        
        // Combine bar data with most recent wait time
        const result = allBars.map(bar => {
          const barWaitTimes = waitTimesByBar[bar.id] || [];
          // Get most recent wait time (already sorted desc by createdAt)
          const mostRecent = barWaitTimes.length > 0 ? barWaitTimes[0] : null;
          
          return {
            ...bar,
            waitMinutes: mostRecent ? mostRecent.waitMinutes : null,
            waitTimeUpdatedAt: mostRecent ? mostRecent.createdAt : null
          };
        });
        
        // Sort by wait time (descending)
        result.sort((a, b) => {
          // Null wait times go to the end
          if (a.waitMinutes === null && b.waitMinutes === null) return 0;
          if (a.waitMinutes === null) return 1;
          if (b.waitMinutes === null) return -1;
          return b.waitMinutes - a.waitMinutes;
        });
        
        console.log(`Successfully processed ${result.length} bars with wait times`);
        res.status(200).json(result);
      } catch (dbError) {
        console.error('Database error in bars API:', dbError);
        Sentry.captureException(dbError);
        res.status(500).json({ error: 'Database error', message: dbError.message });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in bars API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}