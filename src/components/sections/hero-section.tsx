'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section style={{
      padding: '4rem 5%',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#333'
      }}>
        Your Health, In <span style={{ color: '#4CAF50' }}>Rhythm</span>
      </h1>
      <p style={{
        fontSize: '1.2rem',
        color: '#666',
        maxWidth: '600px',
        margin: '1rem auto'
      }}>
        The world's first AI-powered health platform combining Halal nutrition, medical calculators, and expert learning for everyone.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/auth/signup" style={{
          textDecoration: 'none',
          color: 'white',
          backgroundColor: '#4CAF50',
          padding: '1rem 2rem',
          borderRadius: '5px',
          fontWeight: 'bold',
          margin: '0.5rem'
        }}>
          Get Started Free
        </Link>
        <Link href="/learn-more" style={{
          textDecoration: 'none',
          color: '#3A7BED',
          padding: '1rem 2rem',
          borderRadius: '5px',
          fontWeight: 'bold',
          margin: '0.5rem',
          border: '2px solid #3A7BED'
        }}>
          Learn More
        </Link>
      </div>
    </section>
  );
}