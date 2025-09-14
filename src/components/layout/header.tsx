'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X
} from 'lucide-react';

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Calculators', href: '/health-calculators' },
    { name: 'Food Logger', href: '/food-logger' },
    { name: 'MedEd', href: '/meded' }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 5%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f5f7fa'
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#3A7BED',
        textDecoration: 'none'
      }}>
        VitaPulse
      </Link>
      
      {/* Navigation */}
      <nav className="hidden md:flex">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            style={{
              margin: '0 1rem',
              textDecoration: 'none',
              color: '#333'
            }}
          >
            {item.name}
          </Link>
        ))}
        {user ? (
          <button
            onClick={handleSignOut}
            style={{
              marginLeft: '1.5rem',
              textDecoration: 'none',
              color: '#ffffff',
              backgroundColor: '#f44336',
              padding: '0.5rem 1.5rem',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            href="/auth/signin"
            style={{
              marginLeft: '1.5rem',
              textDecoration: 'none',
              color: '#ffffff',
              backgroundColor: '#4CAF50',
              padding: '0.5rem 1.5rem',
              borderRadius: '5px'
            }}
          >
            Login
          </Link>
        )}
      </nav>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg md:hidden z-50">
          <div className="px-4 py-2 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-red-600"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="block px-3 py-2 text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
