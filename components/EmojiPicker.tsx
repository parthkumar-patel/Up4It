'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

// Dynamically import emoji picker to avoid SSR issues
const Picker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full flex items-center justify-center">Loading...</div>
});

interface EmojiPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [title, setTitle] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state with external value
  useEffect(() => {
    setTitle(value);
  }, [value]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTitle(newValue);
    onChange(newValue);
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji;
    const updatedTitle = title + emoji;
    setTitle(updatedTitle);
    onChange(updatedTitle);
    setIsOpen(false);
    
    // Focus back on the input after selecting an emoji
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-grow">
        <Input
          ref={inputRef}
          value={title}
          onChange={handleInputChange}
          placeholder="What are you up to?"
          className="pr-12"
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="end">
            <Picker onEmojiClick={handleEmojiClick} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 