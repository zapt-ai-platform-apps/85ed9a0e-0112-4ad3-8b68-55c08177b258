import React from 'react';
import BarCard from './BarCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const BarList = ({ bars, loading, error }) => {
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading bars: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 btn-primary cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!bars || bars.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No bars found with the current filters.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bars.map(bar => (
        <BarCard key={bar.id} bar={bar} />
      ))}
    </div>
  );
};

export default BarList;