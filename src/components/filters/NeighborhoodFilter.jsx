import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import { FaSearch } from 'react-icons/fa';

const NeighborhoodFilter = ({ selectedNeighborhood, onNeighborhoodChange }) => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/neighborhoods');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch neighborhoods: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched neighborhoods:', data);
        setNeighborhoods(data);
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
        Sentry.captureException(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNeighborhoods();
  }, []);
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      
      <select
        className="select pl-10 pr-8 appearance-none"
        value={selectedNeighborhood || ''}
        onChange={(e) => onNeighborhoodChange(e.target.value || null)}
        disabled={loading}
      >
        <option value="">All Neighborhoods</option>
        {neighborhoods.map(neighborhood => (
          <option key={neighborhood} value={neighborhood}>
            {neighborhood}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">Error: {error}</p>
      )}
    </div>
  );
};

export default NeighborhoodFilter;