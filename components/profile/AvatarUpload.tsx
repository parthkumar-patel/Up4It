'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './Avatar';
import { validateAvatarFile, generateAvatarPreview } from '@/lib/utils/avatar';
import { PROFILE_CONSTRAINTS } from '@/lib/constants/collections';
import { toast } from 'sonner';

interface AvatarUploadProps {
  initialAvatarUrl?: string | null;
  name?: string;
  userId?: string;
  onAvatarChange: (file: File | null) => void;
}

export function AvatarUpload({ 
  initialAvatarUrl, 
  name = '', 
  userId = '',
  onAvatarChange 
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setPreviewUrl(initialAvatarUrl);
      onAvatarChange(null);
      return;
    }

    const validationResult = validateAvatarFile(file);
    
    if (!validationResult.valid) {
      toast.error(validationResult.error);
      return;
    }

    // Generate preview
    generateAvatarPreview(file)
      .then(dataUrl => {
        setPreviewUrl(dataUrl);
        onAvatarChange(file);
      })
      .catch(error => {
        console.error('Error generating preview:', error);
        toast.error('Error generating preview');
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onAvatarChange(null);
  };

  return (
    <motion.div
      className="flex flex-col items-center space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
      >
        <Avatar 
          src={previewUrl}
          name={name}
          userId={userId}
          size="xl"
          className="transition-all duration-200 group-hover:opacity-90"
        />
        
        <AnimatePresence>
          {previewUrl && (
            <motion.button
              type="button"
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
              onClick={handleRemove}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              aria-label="Remove avatar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        className="hidden"
        accept={PROFILE_CONSTRAINTS.ALLOWED_AVATAR_TYPES.join(',')}
      />

      <p className="text-sm text-gray-500 text-center">
        Click or drag & drop to upload <br />
        <span className="text-xs">
          {PROFILE_CONSTRAINTS.ALLOWED_AVATAR_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ')} · 
          Max {PROFILE_CONSTRAINTS.AVATAR_MAX_SIZE_MB}MB
        </span>
      </p>
    </motion.div>
  );
} 