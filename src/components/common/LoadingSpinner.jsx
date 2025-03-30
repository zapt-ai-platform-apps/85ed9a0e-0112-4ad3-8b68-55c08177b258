import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-violet-700"></div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-4 w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-violet-700"></div>
    </div>
  );
};

export default LoadingSpinner;