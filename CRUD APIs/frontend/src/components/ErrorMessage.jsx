import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, errors = [] }) => {
  if (!message && (!errors || errors.length === 0)) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm my-3 shadow-sm">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 text-red-500 mt-0.5" />
        <div>
          {message && <p className="font-semibold">{message}</p>}
          {errors && errors.length > 0 && (
            <ul className="mt-1 list-disc list-inside space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>
                  <span className="font-medium capitalize">{err.field}:</span> {err.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
