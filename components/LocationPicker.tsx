'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  value: {
    lat: number;
    lng: number;
    name?: string;
  };
  onChange: (value: { lat: number; lng: number; name?: string }) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [location, setLocation] = useState(value);
  const [locationName, setLocationName] = useState(value.name || '');

  // This is a placeholder for the actual Mapbox integration
  // In a real implementation, this would use the Mapbox API to select a location on a map
  const getRandomNearbyLocation = () => {
    // UBC coordinates approximately
    const ubc = { lat: 49.2606, lng: -123.2460 };
    
    // Generate a random location within ~1km of UBC
    const randomLat = ubc.lat + (Math.random() - 0.5) * 0.02;
    const randomLng = ubc.lng + (Math.random() - 0.5) * 0.02;
    
    const locations = [
      "UBC Nest",
      "IKB Library",
      "Life Building",
      "AMS Student Union",
      "University Village",
      "Koerner Library",
      "The Pit",
      "UBC Bookstore",
      "Museum of Anthropology",
      "Wreck Beach"
    ];
    
    const randomLocationName = locations[Math.floor(Math.random() * locations.length)];
    
    return {
      lat: randomLat,
      lng: randomLng,
      name: randomLocationName
    };
  };

  const handleSelectLocation = () => {
    const newLocation = getRandomNearbyLocation();
    setLocation(newLocation);
    setLocationName(newLocation.name || '');
    onChange(newLocation);
  };

  const handleLocationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocationName(newName);
    onChange({ ...location, name: newName });
  };

  return (
    <div className="space-y-2">
      <div className="bg-slate-100 h-40 rounded-md flex items-center justify-center relative">
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto text-slate-400" />
          <p className="text-sm text-slate-500 mt-2">
            {location.lat !== 0 && location.lng !== 0 
              ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
              : 'No location selected'}
          </p>
          {locationName && (
            <p className="text-sm font-medium mt-1">{locationName}</p>
          )}
        </div>
        
        <Button
          type="button"
          className="absolute bottom-2 right-2"
          onClick={handleSelectLocation}
        >
          Select Location
        </Button>
      </div>

      <Input
        placeholder="Location name (e.g., UBC Nest)"
        value={locationName}
        onChange={handleLocationNameChange}
      />
      <p className="text-xs text-muted-foreground">
        This is a placeholder. In the full implementation, you will be able to select a location on a map.
      </p>
    </div>
  );
} 