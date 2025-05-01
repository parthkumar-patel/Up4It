import React from 'react';
import SignupFormBackup from '@/components/auth/SignupFormBackup';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Up4It</h1>
        <p className="text-gray-600">Spontaneous campus connections</p>
      </div>
      
      <SignupFormBackup />
      
      <div className="mt-10 text-center text-sm text-gray-500">
        <p>Sign up with your UBC email to get started</p>
      </div>
    </div>
  );
} 