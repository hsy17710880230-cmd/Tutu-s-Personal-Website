'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  // Helper function to handle active link styling
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm pb-4 pt-4">
      <div className="container mx-auto flex items-center justify-between px-6 py-4 pb-4 pt-4">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight text-[#5D4037] transition-opacity hover:opacity-80"
        >
          Tutu Shiyun Hou
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {[
            { name: 'Home', href: '/' },
            { name: 'Portfolio', href: '/portfolio' },
            { name: 'About', href: '/about' },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition-colors duration-200 ${
                isActive(link.href)
                  ? 'text-[#FFD1DC] drop-shadow-sm' // Active color
                  : 'text-[#5D4037] hover:text-[#FFD1DC]' // Inactive color
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;