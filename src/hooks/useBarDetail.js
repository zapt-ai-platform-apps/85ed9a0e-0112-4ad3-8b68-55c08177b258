import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

const useBarDetail = (barId) => {
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBarDetail = async () => {
      if (!barId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Fetching details for bar ID: ${barId}`);
        
        const url = new URL(`/api/bar`, window.location.origin);
        url.searchParams.append('id', barId);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Bar not found');
          }
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Bar details:', data);
        setBar(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching bar details:', error);
        Sentry.captureException(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBarDetail();
  }, [barId]);
  
  return { bar, loading, error };
};

export default useBarDetail;