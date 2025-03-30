import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaClock } from 'react-icons/fa';
import useBarDetail from '@/hooks/useBarDetail';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import * as Sentry from '@sentry/browser';

const ReportWaitTime = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bar, loading, error } = useBarDetail(id);
  
  const [waitMinutes, setWaitMinutes] = useState(15);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      // Validate input
      if (waitMinutes < 0 || waitMinutes > 180) {
        setSubmitError('Wait time must be between 0 and 180 minutes');
        return;
      }
      
      console.log(`Submitting wait time: ${waitMinutes} minutes for bar ID: ${id}`);
      
      const response = await fetch('/api/report-wait-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barId: Number(id),
          waitMinutes: Number(waitMinutes),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit wait time');
      }
      
      const data = await response.json();
      console.log('Submission successful:', data);
      
      setSubmitSuccess(true);
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate(`/bar/${id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting wait time:', error);
      Sentry.captureException(error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
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
  
  return (
    <div className="container mx-auto px-4 max-w-md">
      <Link to={`/bar/${id}`} className="inline-flex items-center text-violet-700 hover:text-violet-800 mb-4">
        <FaArrowLeft className="mr-1" /> Back to {bar.name}
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Report Wait Time for {bar.name}
          </h1>
          
          {submitSuccess ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>Wait time reported successfully! Redirecting you back...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{submitError}</p>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="waitMinutes">
                  Current Wait Time (minutes)
                </label>
                
                <div className="flex items-center">
                  <FaClock className="text-gray-500 mr-3" />
                  <input
                    id="waitMinutes"
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={waitMinutes}
                    onChange={(e) => setWaitMinutes(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-violet-700">{waitMinutes} minutes</span>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No wait</span>
                  <span>30 min</span>
                  <span>1 hour</span>
                  <span>2 hours</span>
                  <span>3 hours</span>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-3 text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Wait Time'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportWaitTime;