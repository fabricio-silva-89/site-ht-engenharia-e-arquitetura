'use client';

import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">Sobre nós</p>
          <h2
            className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Design que inspira,
            <br />
            construção que transforma
          </h2>
          <p className="text-secondary leading-relaxed mb-4">
            Somos um escritório de arquitetura dedicado a criar espaços que combinam
            estética sofisticada com funcionalidade inteligente. Cada projeto é único,
            pensado para refletir a personalidade e as necessidades de nossos clientes.
          </p>
          <p className="text-secondary leading-relaxed">
            Com experiência em projetos residenciais e comerciais, transformamos ideias
            em ambientes que contam histórias e proporcionam bem-estar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-6"
        >
          {[
            { number: '50+', label: 'Projetos realizados' },
            { number: '10+', label: 'Anos de experiência' },
            { number: '100%', label: 'Clientes satisfeitos' },
            { number: '∞', label: 'Dedicação' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-muted">
              <p className="text-3xl font-bold text-accent mb-1">{stat.number}</p>
              <p className="text-sm text-secondary">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
