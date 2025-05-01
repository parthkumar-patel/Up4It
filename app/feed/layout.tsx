import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Activity Feed | Up4It',
  description: 'See what activities are happening around you right now',
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background pb-16">
      {children}
      <Navbar />
    </main>
  );
} 