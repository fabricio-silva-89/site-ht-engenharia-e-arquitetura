import { contactSchema } from '@/lib/schemas/project';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RATE_LIMIT_MAP = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

export async function POST(req: NextRequest) {
  // Simple rate limiting by IP
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const lastRequest = RATE_LIMIT_MAP.get(ip);
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
    return NextResponse.json(
      { error: 'Aguarde antes de enviar outra mensagem.' },
      { status: 429 }
    );
  }
  RATE_LIMIT_MAP.set(ip, now);

  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = result.data;

    await resend.emails.send({
      from: 'Site <noreply@hitalothaina.com.br>',
      to: ['contato@hitalothaina.com.br'],
      replyTo: email,
      subject: `Contato via site - ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nTelefone: ${phone || 'Não informado'}\n\nMensagem:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Erro interno ao enviar mensagem.' },
      { status: 500 }
    );
  }
}
