import React from 'react';
import { FaClock } from 'react-icons/fa';

const WaitTimeBadge = ({ waitMinutes }) => {
  // Determine badge style based on wait time
  let badgeClass = 'wait-time-unknown';
  let waitText = 'Unknown wait';
  
  if (waitMinutes !== null && waitMinutes !== undefined) {
    waitText = `${waitMinutes} min wait`;
    
    if (waitMinutes <= 10) {
      badgeClass = 'wait-time-low';
    } else if (waitMinutes <= 30) {
      badgeClass = 'wait-time-medium';
    } else {
      badgeClass = 'wait-time-high';
    }
  }
  
  return (
    <span className={`wait-time-badge ${badgeClass}`}>
      <FaClock className="mr-1" />
      {waitText}
    </span>
  );
};

export default WaitTimeBadge;