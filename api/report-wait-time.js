import { getDbClient } from './_db.js';
import { bars, waitTimes } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  try {
    console.log('Report wait time API called with method:', req.method);
    
    if (req.method === 'POST') {
      const { barId, waitMinutes } = req.body;
      
      console.log(`Received wait time report: barId=${barId}, waitMinutes=${waitMinutes}`);
      
      if (!barId || typeof waitMinutes !== 'number') {
        return res.status(400).json({ 
          error: 'Invalid request data',
          details: 'Both barId and waitMinutes are required. waitMinutes must be a number.'
        });
      }
      
      if (waitMinutes < 0 || waitMinutes > 180) {
        return res.status(400).json({
          error: 'Invalid wait time',
          details: 'Wait time must be between 0 and 180 minutes'
        });
      }
      
      try {
        const db = getDbClient();
        
        // Convert barId to a number and validate
        const parsedBarId = parseInt(barId, 10);
        if (isNaN(parsedBarId)) {
          return res.status(400).json({ error: 'Invalid bar ID' });
        }
        
        // Verify bar exists
        const barExists = await db.select({ id: bars.id })
          .from(bars)
          .where(eq(bars.id, parsedBarId))
          .limit(1);
        
        if (barExists.length === 0) {
          return res.status(404).json({ error: 'Bar not found' });
        }
        
        // Get client IP for rate limiting
        const reporterIp = req.headers['x-forwarded-for'] || 
                          req.connection.remoteAddress;
        
        // Insert new wait time
        const result = await db.insert(waitTimes)
          .values({
            barId: parsedBarId,
            waitMinutes: waitMinutes,
            reporterIp: reporterIp
          })
          .returning();
        
        console.log(`Successfully reported wait time with ID: ${result[0].id}`);
        
        res.status(201).json({
          success: true,
          message: 'Wait time reported successfully',
          id: result[0].id
        });
      } catch (dbError) {
        console.error('Database error in report wait time API:', dbError);
        Sentry.captureException(dbError);
        res.status(500).json({ error: 'Database error', message: dbError.message });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in report wait time API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}