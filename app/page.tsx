import { redirect } from 'next/navigation';

// Simple redirect to the feed page
// Authentication handling is now done by middleware
export default function Home() {
  redirect('/feed');
}
