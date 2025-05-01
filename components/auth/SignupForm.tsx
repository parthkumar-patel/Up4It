'use client';

import React, { useState } from 'react';
import * as framerMotion from 'framer-motion';
const { motion, AnimatePresence } = framerMotion;

import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signIn } = useAuth();

  const validateEmail = (email: string): boolean => {
    const validDomains = ['@student.ubc.ca', '@alumni.ubc.ca'];
    const isValidDomain = validDomains.some(domain => email.endsWith(domain));
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailPattern.test(email);
    
    return isValidFormat && isValidDomain;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      toast.error('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please use a valid UBC email address (@student.ubc.ca or @alumni.ubc.ca)');
      toast.error('Please use a valid UBC email address');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Since we're using magic links, signup is the same as signin
      await signIn(email);
      setSuccess(true);
      toast.success('Magic link sent! Check your email to complete signup.');
    } catch (err: unknown) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send magic link. Please try again.');
      toast.error(err instanceof Error ? err.message : 'Failed to send magic link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-2 text-center">Join Up4It</h2>
      <p className="text-center text-gray-500 mb-6">Connect with others on campus</p>
      
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            className="p-6 rounded-md bg-green-50 border border-green-100 text-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <svg 
                className="w-16 h-16 text-green-500 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h3 className="text-xl font-medium text-green-800 mb-2">Magic Link Sent!</h3>
              <p className="text-green-700 mb-4">
                Check your email inbox to sign in and complete your profile.
              </p>
              <p className="text-sm text-green-600">
                Didn&apos;t receive an email? Check your spam folder or try again.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                UBC Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@student.ubc.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={isSubmitting}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be an @student.ubc.ca or @alumni.ubc.ca email
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="p-3 rounded-md bg-red-50 border border-red-100 text-red-700 text-sm"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                transition-all text-white font-medium
                ${isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </div>
              ) : 'Create Account'}
            </button>
            
            <div className="text-center text-sm mt-4">
              <p className="text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 