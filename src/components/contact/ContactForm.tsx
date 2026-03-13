'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { contactSchema, type ContactSchemaType } from '@/lib/schemas/project';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactSchemaType, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactSchemaType;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error('Erro ao enviar');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-accent text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-primary mb-2">Mensagem enviada!</h3>
        <p className="text-secondary">Entraremos em contato em breve.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-accent hover:text-accent-dark transition-colors"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Seu nome completo"
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="seu@email.com"
        required
      />
      <Input
        label="Telefone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="(00) 00000-0000"
      />
      <div className="space-y-1">
        <label htmlFor="message" className="block text-sm font-medium text-primary">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          className={`w-full border px-4 py-3 text-sm text-primary placeholder:text-secondary/50 transition-colors focus:outline-none focus:border-accent resize-none ${
            errors.message ? 'border-error' : 'border-border'
          }`}
          placeholder="Descreva seu projeto ou dúvida..."
          required
        />
        {errors.message && <p className="text-xs text-error">{errors.message}</p>}
      </div>

      {status === 'error' && (
        <p className="text-sm text-error">Ocorreu um erro. Tente novamente.</p>
      )}

      <Button type="submit" disabled={status === 'sending'} className="w-full">
        {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
      </Button>
    </form>
  );
}
