import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import useBarDetail from '@/hooks/useBarDetail';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import WaitTimeBadge from '@/components/common/WaitTimeBadge';
import { formatDistanceToNow } from 'date-fns';

const BarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bar, loading, error } = useBarDetail(id);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  if (!bar) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Bar not found</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  // Default image if none provided
  const imageUrl = bar.imageUrl || 'https://via.placeholder.com/800x400?text=NYC+Bar';
  
  // Get most recent wait time if available
  const latestWaitTime = bar.waitTimes && bar.waitTimes.length > 0 
    ? bar.waitTimes[0] 
    : null;
  
  return (
    <div className="container mx-auto px-4">
      <Link to="/" className="inline-flex items-center text-violet-700 hover:text-violet-800 mb-4">
        <FaArrowLeft className="mr-1" /> Back to all bars
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={bar.name}
            className="w-full h-full object-cover" 
            data-image-request={!bar.imageUrl ? `${bar.name} bar in ${bar.neighborhood} New York City interior` : undefined}
          />
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">{bar.name}</h1>
            {latestWaitTime && (
              <WaitTimeBadge waitMinutes={latestWaitTime.waitMinutes} />
            )}
          </div>
          
          <div className="flex items-center mb-4">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <p className="text-gray-600">{bar.address}, {bar.neighborhood}</p>
          </div>
          
          {bar.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700">{bar.description}</p>
            </div>
          )}
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Current Wait Time</h2>
              <Link 
                to={`/report/${bar.id}`}
                className="inline-flex items-center text-violet-700 hover:text-violet-800"
              >
                <FaEdit className="mr-1" /> Update
              </Link>
            </div>
            
            {latestWaitTime ? (
              <div>
                <div className="flex items-center mb-1">
                  <FaClock className="text-gray-500 mr-2" />
                  <span className="text-lg font-medium">
                    {latestWaitTime.waitMinutes} minutes
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  Updated {formatDistanceToNow(new Date(latestWaitTime.createdAt), { addSuffix: true })}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No wait time reported yet.</p>
            )}
          </div>
          
          {bar.waitTimes && bar.waitTimes.length > 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Recent Wait Times</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Wait Time</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Reported</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bar.waitTimes.slice(1).map(waitTime => (
                      <tr key={waitTime.id} className="border-t border-gray-200">
                        <td className="px-4 py-2 text-gray-700">{waitTime.waitMinutes} minutes</td>
                        <td className="px-4 py-2 text-gray-500 text-sm">
                          {formatDistanceToNow(new Date(waitTime.createdAt), { addSuffix: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center mb-8">
        <Link 
          to={`/report/${bar.id}`}
          className="btn-primary inline-flex items-center cursor-pointer"
        >
          <FaEdit className="mr-2" /> Report Current Wait Time
        </Link>
      </div>
    </div>
  );
};

export default BarDetail;