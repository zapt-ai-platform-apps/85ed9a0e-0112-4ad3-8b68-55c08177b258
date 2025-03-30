import { getDbClient } from './_db.js';
import { bars, waitTimes } from '../drizzle/schema.js';
import { sql, desc, eq, and, gt, lte } from 'drizzle-orm';
import { subHours } from 'date-fns';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  try {
    console.log('Bars API called with method:', req.method);
    
    if (req.method === 'GET') {
      const db = getDbClient();
      
      // Get query parameters
      const neighborhood = req.query.neighborhood || null;
      
      // Subquery to get the latest wait time for each bar
      const latestWaitTimes = db.$with('latest_wait_times').as(
        db.select({
          barId: waitTimes.barId,
          waitMinutes: waitTimes.waitMinutes,
          createdAt: waitTimes.createdAt,
          rowNum: sql`ROW_NUMBER() OVER (PARTITION BY ${waitTimes.barId} ORDER BY ${waitTimes.createdAt} DESC)`.as('row_num')
        })
        .from(waitTimes)
        .where(gt(waitTimes.createdAt, subHours(new Date(), 4))) // Only consider wait times from the last 4 hours
      );
      
      let query = db.select({
        id: bars.id,
        name: bars.name,
        address: bars.address,
        neighborhood: bars.neighborhood,
        latitude: bars.latitude,
        longitude: bars.longitude,
        imageUrl: bars.imageUrl,
        waitMinutes: latestWaitTimes.waitMinutes,
        waitTimeUpdatedAt: latestWaitTimes.createdAt
      })
      .from(bars)
      .leftJoin(latestWaitTimes, and(
        eq(bars.id, latestWaitTimes.barId),
        eq(latestWaitTimes.rowNum, 1)
      ));
      
      // Apply neighborhood filter if provided
      if (neighborhood) {
        query = query.where(eq(bars.neighborhood, neighborhood));
      }
      
      const result = await query.orderBy(desc(latestWaitTimes.waitMinutes));
      console.log(`Retrieved ${result.length} bars`);
      
      res.status(200).json(result);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in bars API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}