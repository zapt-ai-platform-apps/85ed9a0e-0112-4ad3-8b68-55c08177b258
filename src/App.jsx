import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy-loaded components
const Home = lazy(() => import('@/pages/Home'));
const BarDetail = lazy(() => import('@/pages/BarDetail'));
const ReportWaitTime = lazy(() => import('@/pages/ReportWaitTime'));

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bar/:id" element={<BarDetail />} />
            <Route path="/report/:id" element={<ReportWaitTime />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default App;