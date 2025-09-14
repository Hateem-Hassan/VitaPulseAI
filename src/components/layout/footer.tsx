'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      padding: '2rem 5%',
      textAlign: 'center',
      backgroundColor: '#f5f7fa',
      marginTop: '3rem'
    }}>
      <p style={{
        color: '#666',
        marginBottom: '1rem'
      }}>
        &copy; 2023 VitaPulse. All rights reserved.
      </p>
      <div>
        <Link href="/privacy" style={{
          margin: '0 0.5rem',
          color: '#3A7BED',
          textDecoration: 'none'
        }}>
          Privacy Policy
        </Link>
        <Link href="/terms" style={{
          margin: '0 0.5rem',
          color: '#3A7BED',
          textDecoration: 'none'
        }}>
          Terms of Service
        </Link>
        <Link href="/contact" style={{
          margin: '0 0.5rem',
          color: '#3A7BED',
          textDecoration: 'none'
        }}>
          Contact
        </Link>
      </div>
    </footer>
  );
}
