import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <span className="text-7xl">🥦 404</span>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm">
        Oops! The grocery page or aisle you were looking for doesn't exist or has been moved.
      </p>
      <Button variant="primary" size="md" onClick={() => navigate('/')}>
        Return to SkyMart Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
