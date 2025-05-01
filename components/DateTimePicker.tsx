'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Round the time to the nearest 5 minutes when the component loads
  useEffect(() => {
    if (date) {
      setSelectedDate(roundToNearest5Minutes(date));
    }
  }, [date]);

  // Function to round time to nearest 5 minutes
  const roundToNearest5Minutes = (dateToRound: Date): Date => {
    const minutes = dateToRound.getMinutes();
    const remainder = minutes % 5;
    
    const roundedDate = new Date(dateToRound);
    
    if (remainder < 3) {
      // Round down
      roundedDate.setMinutes(minutes - remainder);
    } else {
      // Round up
      roundedDate.setMinutes(minutes + (5 - remainder));
    }
    
    // Set seconds and milliseconds to zero
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);
    
    return roundedDate;
  };

  // Update parent component with selected date and time
  const handleSelectDateTime = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    // Create a new date with time from the current selection
    const hours = selectedDate ? selectedDate.getHours() : new Date().getHours();
    const minutes = selectedDate ? selectedDate.getMinutes() : new Date().getMinutes();
    
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    const roundedDate = roundToNearest5Minutes(newDate);
    setSelectedDate(roundedDate);
    setDate(roundedDate);
  };

  // Handle hour changes
  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedDate) return;
    
    const newDate = new Date(selectedDate);
    newDate.setHours(parseInt(e.target.value, 10));
    
    const roundedDate = roundToNearest5Minutes(newDate);
    setSelectedDate(roundedDate);
    setDate(roundedDate);
  };

  // Handle minute changes
  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedDate) return;
    
    const newDate = new Date(selectedDate);
    newDate.setMinutes(parseInt(e.target.value, 10));
    
    // No need to round for direct minute selection since we're providing options in 5-min intervals
    setSelectedDate(newDate);
    setDate(newDate);
  };

  // Generate hours options (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate minutes options (0, 5, 10, ..., 55)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="flex flex-col space-y-2">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              handleSelectDateTime(date);
              setIsCalendarOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        
        <select
          value={selectedDate ? selectedDate.getHours() : new Date().getHours()}
          onChange={handleHourChange}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Hour"
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <span>:</span>
        <select
          value={selectedDate ? Math.floor(selectedDate.getMinutes() / 5) * 5 : 0}
          onChange={handleMinuteChange}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Minute"
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 