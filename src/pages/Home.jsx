import React, { useState } from 'react';
import BarList from '@/components/bars/BarList';
import NeighborhoodFilter from '@/components/filters/NeighborhoodFilter';
import useBars from '@/hooks/useBars';

const Home = () => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const { bars, loading, error } = useBars(selectedNeighborhood);
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">NYC Bar Lines</h1>
        <p className="text-gray-600 mb-6">
          Real-time wait times for the best bars across New York City. 
          Know before you go and avoid the lines!
        </p>
        
        <div className="max-w-md mb-6">
          <NeighborhoodFilter 
            selectedNeighborhood={selectedNeighborhood}
            onNeighborhoodChange={setSelectedNeighborhood}
          />
        </div>
      </div>
      
      <BarList 
        bars={bars}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Home;