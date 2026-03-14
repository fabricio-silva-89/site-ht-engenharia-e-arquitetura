'use client';

import { ButtonLink } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center min-h-[90vh] bg-muted overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #2c2c2c 1px, transparent 1px), linear-gradient(#2c2c2c 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-accent mb-6"
        >
          Engenharia & Arquitetura
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Transformamos espaços
          <br />
          <span className="text-accent">em experiências</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-lg text-secondary max-w-2xl mx-auto"
        >
          Projetos residenciais e comerciais com design sofisticado, funcionalidade
          e atenção a cada detalhe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <ButtonLink href="/projetos" size="lg">
            Ver Projetos
          </ButtonLink>
          <ButtonLink href="/contato" variant="outline" size="lg">
            Fale Conosco
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
