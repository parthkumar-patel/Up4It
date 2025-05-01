import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Your Matches | Up4It',
  description: 'Manage activities you\'ve joined or created',
};

export default function MatchesLayout({
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