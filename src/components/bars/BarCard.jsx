import React from 'react';
import { Link } from 'react-router-dom';
import WaitTimeBadge from '@/components/common/WaitTimeBadge';
import { formatDistanceToNow } from 'date-fns';

const BarCard = ({ bar }) => {
  // Format last updated time if available
  const lastUpdated = bar.waitTimeUpdatedAt 
    ? formatDistanceToNow(new Date(bar.waitTimeUpdatedAt), { addSuffix: true })
    : null;
  
  // Default image if none provided
  const imageUrl = bar.imageUrl || 'https://via.placeholder.com/300x200?text=NYC+Bar';
  
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <Link to={`/bar/${bar.id}`} className="block">
        <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={bar.name}
            className="w-full h-48 object-cover" 
            data-image-request={!bar.imageUrl ? `${bar.name} bar in ${bar.neighborhood} New York City` : undefined}
          />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 mr-2">{bar.name}</h3>
            <WaitTimeBadge waitMinutes={bar.waitMinutes} />
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{bar.neighborhood}</p>
          <p className="text-gray-500 text-sm">{bar.address}</p>
          
          {lastUpdated && (
            <p className="text-gray-400 text-xs mt-2">
              Updated {lastUpdated}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BarCard;