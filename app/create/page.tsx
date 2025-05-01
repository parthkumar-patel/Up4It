'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmojiPicker } from '@/components/EmojiPicker';
import { DateTimePicker } from '@/components/DateTimePicker';
import { LocationPicker } from '@/components/LocationPicker';
import { ActivityService } from '@/services/ActivityService';

// Form schema with validations
const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters.',
  }).max(40, {
    message: 'Title cannot be longer than 40 characters.'
  }),
  description: z.string().max(200, {
    message: 'Description cannot be longer than 200 characters.'
  }).optional(),
  activityType: z.string().min(2, {
    message: 'Please select a valid activity type.'
  }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    name: z.string().optional(),
  }).refine(location => location.lat !== 0 && location.lng !== 0, {
    message: "Please select a location"
  }),
  startTime: z.date().refine((date) => {
    // Must be in the future
    return date > new Date();
  }, {
    message: 'Start time must be in the future.'
  }),
  radiusMeters: z.number().min(50).max(5000).default(500),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateActivityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      activityType: 'social',
      location: {
        lat: 0,
        lng: 0,
        name: '',
      },
      startTime: new Date(Date.now() + 30 * 60 * 1000), // Default: 30 minutes from now
      radiusMeters: 500,
    },
  });

  // Handle form submission
  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      
      // TODO: Get user ID from authentication context
      const userId = 'temp-user-id'; // Temporary placeholder
      
      // Create the activity
      await ActivityService.createActivity(userId, {
        title: values.title,
        description: values.description,
        activityType: values.activityType,
        locationLat: values.location.lat,
        locationLng: values.location.lng,
        locationName: values.location.name,
        radiusMeters: values.radiusMeters,
        startTime: values.startTime,
      });
      
      // Show success toast
      toast.success('Activity created successfully!');
      
      // Navigate to feed page after successful creation
      router.push('/feed');
      
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Failed to create activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-6">Create New Activity</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* What field with emoji picker */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What</FormLabel>
                  <FormControl>
                    <EmojiPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description field (optional) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add some details about your activity" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Activity Type field */}
            <FormField
              control={form.control}
              name="activityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="social">Social</option>
                      <option value="study">Study</option>
                      <option value="sport">Sport</option>
                      <option value="food">Food</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Where field with location picker */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where</FormLabel>
                  <FormControl>
                    <LocationPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* When field with date/time picker */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>When</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Radius field */}
            <FormField
              control={form.control}
              name="radiusMeters"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Radius (meters)</FormLabel>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>50m</span>
                      <span>5000m</span>
                    </div>
                    <FormControl>
                      <input
                        type="range"
                        min={50}
                        max={5000}
                        step={50}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                        {...rest}
                      />
                    </FormControl>
                    <div className="text-center font-medium">
                      {value}m
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Submit button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Activity'}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
} 