'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface MobileMenuProps {
  links: { href: string; label: string }[];
  pathname: string;
  onClose: () => void;
}

export default function MobileMenu({ links, pathname, onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link href="/" onClick={onClose} className="text-xl font-bold tracking-tight text-primary">
          H&T <span className="font-normal text-secondary">Engenharia & Arquitetura</span>
        </Link>
        <button onClick={onClose} className="p-2 text-primary" aria-label="Fechar menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col items-center justify-center gap-8 pt-20">
        {links.map(({ href, label }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={href}
              onClick={onClose}
              className={`text-2xl uppercase tracking-widest transition-colors ${
                pathname === href ? 'text-accent' : 'text-primary hover:text-accent'
              }`}
            >
              {label}
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}
