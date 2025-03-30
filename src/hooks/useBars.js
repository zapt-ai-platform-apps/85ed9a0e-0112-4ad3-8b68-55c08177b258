import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

const useBars = (neighborhood = null) => {
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBars = async () => {
      try {
        setLoading(true);
        // Build URL with query parameters
        const url = new URL('/api/bars', window.location.origin);
        if (neighborhood) {
          url.searchParams.append('neighborhood', neighborhood);
        }
        
        console.log(`Fetching bars from ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Retrieved ${data.length} bars`);
        setBars(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching bars:', error);
        Sentry.captureException(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBars();
  }, [neighborhood]);
  
  return { bars, loading, error };
};

export default useBars;