import React from 'react';

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          You are registered successfully!
        </h2>
        <p className="text-gray-600">
          Please check your email to confirm.
        </p>
      </div>
    </div>
  );
};

export default page;
