# Plan: Portfolio Arquitetura — Site Hitalo & Thaina

## Status: Approved v1

## TL;DR
Site de portfólio profissional de arquitetura/construção com 3 páginas públicas (Home, Projetos, Contato) + painel admin para CRUD de projetos. Stack: Next.js 14 (App Router) + Tailwind CSS + Firebase (Firestore + Storage). Foco em SEO avançado, performance e design minimalista.

---

## 1. Arquitetura do Sistema

### Stack Tecnológica
- **Framework**: Next.js 14+ (App Router) — SSR/SSG para SEO, rotas dinâmicas, Image Optimization
- **Styling**: Tailwind CSS 3.4+ — design system minimalista, responsivo mobile-first
- **Animações**: Framer Motion — transições suaves entre páginas e elementos
- **Backend**: Firebase (Firestore + Storage) — sem necessidade de servidor dedicado
- **Auth**: Firebase Authentication (Email/Password para admin)
- **Hospedagem**: Vercel — CDN global, edge functions, integração nativa com Next.js
- **Formulário de Contato**: Resend ou EmailJS para envio de emails
- **Compressão de Imagens**: Sharp (via Next.js Image) + compressão no upload (browser-image-compression)

### Decisões Arquiteturais
- **App Router (não Pages Router)**: melhor suporte a Server Components, layouts aninhados, metadata API nativa
- **ISR (Incremental Static Regeneration)**: páginas de projetos pré-renderizadas com revalidação sob demanda
- **Server Components por padrão**: minimiza JS no cliente, melhor performance
- **Route Handlers para API**: /api/revalidate para invalidar cache após CRUD no admin

---

## 2. Estrutura de Pastas

```
site-hitalo-thaina/
├── public/
│   ├── robots.txt
│   ├── sitemap.xml          (gerado dinamicamente)
│   ├── favicon.ico
│   ├── og-default.jpg        (imagem OG padrão)
│   └── fonts/                (fontes locais para performance)
├── src/
│   ├── app/
│   │   ├── layout.tsx         (root layout: header, footer, metadata global)
│   │   ├── page.tsx           (Home)
│   │   ├── projetos/
│   │   │   ├── page.tsx       (listagem grid)
│   │   │   └── [slug]/
│   │   │       └── page.tsx   (página individual do projeto)
│   │   ├── contato/
│   │   │   └── page.tsx       (formulário + info)
│   │   ├── admin/
│   │   │   ├── layout.tsx     (layout admin com auth guard)
│   │   │   ├── page.tsx       (dashboard/lista projetos)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── projetos/
│   │   │   │   ├── novo/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  (editar projeto)
│   │   │   └── components/
│   │   │       ├── ProjectForm.tsx
│   │   │       ├── ImageUploader.tsx
│   │   │       └── ImageSortable.tsx
│   │   ├── api/
│   │   │   ├── revalidate/
│   │   │   │   └── route.ts   (revalidação sob demanda)
│   │   │   └── contact/
│   │   │       └── route.ts   (envio de email)
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                (componentes base reutilizáveis)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   └── FeaturedProjects.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGrid.tsx
│   │   │   ├── ProjectGallery.tsx
│   │   │   └── ProjectInfo.tsx
│   │   └── contact/
│   │       ├── ContactForm.tsx
│   │       └── ContactInfo.tsx
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts      (inicialização Firebase)
│   │   │   ├── firestore.ts   (funções CRUD projetos)
│   │   │   ├── storage.ts     (upload/delete imagens)
│   │   │   └── auth.ts        (funções de autenticação)
│   │   ├── schemas/
│   │   │   └── project.ts     (Zod schemas para validação)
│   │   └── utils/
│   │       ├── seo.ts         (helpers de metadata/structured data)
│   │       ├── image.ts       (compressão/resize no cliente)
│   │       └── slug.ts        (geração de slug)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useProjects.ts
│   ├── types/
│   │   └── project.ts        (TypeScript interfaces)
│   └── styles/
│       └── globals.css        (Tailwind directives + custom CSS)
├── .env.local                 (Firebase keys, Resend API key)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Modelagem Firestore

### Collection: `projects`

```
projects/{documentId}
├── id: string (auto-generated)
├── name: string
├── slug: string (único, indexado)
├── shortDescription: string (max 160 chars — ideal para meta description)
├── fullDescription: string (rich text / markdown)
├── location: string
├── year: number
├── builtArea: string (ex: "250m²")
├── coverImage: {
│     url: string,
│     path: string (Storage path para delete),
│     alt: string
│   }
├── images: [
│     {
│       url: string,
│       path: string,
│       alt: string,
│       order: number
│     }
│   ]
├── featured: boolean (para destaque na home)
├── published: boolean (draft/publicado)
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### Índices Firestore necessários:
- `slug` (ASC) — busca por slug
- `featured` (ASC) + `createdAt` (DESC) — projetos destacados
- `published` (ASC) + `createdAt` (DESC) — listagem pública

### Regras de Segurança Firestore:
```
- Leitura pública: where published == true
- Escrita: apenas usuários autenticados (admin)
```

---

## 4. Estrutura de Rotas

### Públicas
| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | SSG + ISR | Home com hero + projetos destacados |
| `/projetos` | SSG + ISR | Grid de todos os projetos publicados |
| `/projetos/[slug]` | SSG + ISR | Página individual com galeria |
| `/contato` | Static | Formulário + informações |

### Admin (Client-side, protegidas por auth)
| Rota | Descrição |
|------|-----------|
| `/admin/login` | Tela de login |
| `/admin` | Dashboard com lista de projetos |
| `/admin/projetos/novo` | Formulário de criação |
| `/admin/projetos/[id]` | Formulário de edição |

### API Routes
| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/revalidate` | POST | Revalida páginas após CRUD |
| `/api/contact` | POST | Envia email do formulário |

---

## 5. Fluxo de Upload de Imagens

1. **Seleção**: Admin seleciona múltiplas imagens via input file ou drag-and-drop
2. **Compressão no cliente**: browser-image-compression reduz para max 1920px largura, qualidade 80%, formato WebP quando possível
3. **Upload para Firebase Storage**: path `projects/{projectId}/{timestamp}_{filename}`
4. **URL pública**: obtém downloadURL após upload
5. **Salva referência no Firestore**: url + path + alt + order
6. **Ordenação**: drag-and-drop com @dnd-kit/sortable para reordenar imagens
7. **Definir capa**: clique para marcar imagem como coverImage
8. **Delete**: ao remover imagem, deleta do Storage e atualiza Firestore
9. **Servir no site**: Next.js Image component com loader personalizado para Firebase Storage URLs

---

## 6. Estratégia de SEO

### Metadata API (Next.js)
- Cada página exporta `generateMetadata()` com title, description, openGraph, twitter
- Páginas de projeto usam dados do Firestore para metadata dinâmica
- Imagem OG: coverImage do projeto ou imagem padrão

### URLs Amigáveis
- `/projetos/residencia-jardim-europa` (slug gerado do nome)
- Slugs únicos validados no cadastro

### Structured Data (Schema.org)
- **HomePage**: Organization + WebSite
- **Projetos (listagem)**: CollectionPage + ItemList
- **Projeto individual**: Article ou CreativeWork com imagens, localização, descrição
- **Contato**: Organization com contactPoint

### Sitemap & Robots
- `sitemap.xml` gerado dinamicamente via `app/sitemap.ts` (Next.js native)
- `robots.txt` via `app/robots.ts`
- Exclui `/admin/*` do sitemap e robots

### Performance SEO
- Next.js Image: lazy loading nativo, formatos modernos (WebP/AVIF), srcset responsivo
- Fontes locais (next/font) — elimina render-blocking
- Prefetch de links visíveis
- Alt text obrigatório em todas as imagens (validado no admin via Zod)

---

## 7. Estratégia de Performance

- **Core Web Vitals targets**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **ISR**: páginas pré-renderizadas, revalidação sob demanda no CRUD
- **Image Optimization**: Next.js Image com sizes responsivos, placeholder blur
- **CDN**: Vercel Edge Network (global)
- **Code Splitting**: automático via App Router
- **Server Components**: reduz bundle JS no cliente
- **Font Display**: `font-display: swap` via next/font

---

## 8. Estratégia de Segurança

- **Firebase Security Rules**: leitura pública apenas para `published == true`, escrita restrita a UID admin
- **Firebase Storage Rules**: leitura pública, escrita restrita a UID admin
- **Auth Guard no Admin**: middleware ou layout component que redireciona para login
- **Rate Limiting**: no route handler de contato (ex: upstash/ratelimit)
- **Validação**: Zod em todos os inputs (formulário de contato + CRUD projetos)
- **Sanitização**: DOMPurify para rich text/markdown antes de renderizar
- **Variáveis de ambiente**: Firebase keys em `.env.local`, nunca commitadas
- **CSRF**: protegido nativamente pelos Route Handlers do Next.js
- **Headers de segurança**: configurados no `next.config.js` (CSP, X-Frame-Options, etc.)

---

## 9. Estratégia de Deploy

### Ambiente
- **Hospedagem**: Vercel (free tier suporta o volume esperado)
- **Firebase**: projeto único com Firestore + Storage + Auth
- **Domínio**: configurar domínio customizado no Vercel
- **DNS**: Vercel DNS ou Cloudflare

### CI/CD
- Push para `main` → deploy automático via Vercel Git Integration
- Preview deploys para branches/PRs
- Variáveis de ambiente configuradas no Vercel Dashboard

### Checklist de Deploy
1. Criar projeto Firebase e habilitar Firestore, Storage, Auth
2. Configurar Security Rules (Firestore + Storage)
3. Criar usuário admin no Firebase Auth
4. Configurar variáveis de ambiente no Vercel
5. Conectar repositório ao Vercel
6. Configurar domínio customizado
7. Validar sitemap e robots.txt
8. Submeter sitemap ao Google Search Console
9. Testar PageSpeed e Core Web Vitals

---

## 10. Fases de Implementação

### Fase 1 — Setup & Infraestrutura (Steps 1-3)
1. Inicializar projeto Next.js 14 + Tailwind + TypeScript
2. Configurar Firebase (config, Firestore, Storage, Auth)
3. Definir tipos TypeScript, schemas Zod, e utilitários base

### Fase 2 — Layout & Componentes Base (Steps 4-6)
4. Implementar Header (logo, menu, ícones sociais, mobile menu)
5. Implementar Footer
6. Configurar fontes, cores, design tokens no Tailwind

### Fase 3 — Páginas Públicas (Steps 7-11)
7. Home: HeroSection + AboutSection + FeaturedProjects
8. Projetos (listagem): grid responsivo com ProjectCard
9. Projetos [slug]: galeria de imagens + informações detalhadas
10. Contato: formulário + informações + API route de envio
11. Animações com Framer Motion (page transitions, scroll animations)

### Fase 4 — Admin (Steps 12-16)
12. Tela de login com Firebase Auth
13. Auth guard (layout protegido)
14. Dashboard: listagem de projetos com ações (editar, excluir, publicar)
15. Formulário de projeto: campos + validação Zod
16. Upload de imagens: múltiplo, compressão, ordenação drag-and-drop, definir capa

### Fase 5 — SEO & Performance (Steps 17-20)
17. Metadata dinâmica em todas as páginas (generateMetadata)
18. Structured data (JSON-LD) em cada página
19. Sitemap.xml e robots.txt dinâmicos
20. Otimização de imagens, fontes, headers de segurança

### Fase 6 — Revalidação & Integração (Steps 21-22)
21. API route de revalidação sob demanda (chamada após CRUD no admin)
22. Integração completa: admin salva → revalida → site atualiza

### Fase 7 — Deploy & QA (Steps 23-25)
23. Deploy no Vercel + configuração de domínio
24. Testes manuais: responsividade, formulário, admin CRUD, SEO
25. Validação: PageSpeed, Core Web Vitals, Google Rich Results Test, Search Console

---

## Decisões
- **Next.js App Router** sobre Pages Router: metadata API nativa, Server Components, melhor DX
- **ISR + revalidação sob demanda** sobre SSR puro: melhor performance, controle de cache
- **Firebase** como backend: conforme requisito, sem servidor para manter
- **Vercel** para hospedagem: integração nativa com Next.js, CDN global, free tier generoso
- **Framer Motion** para animações: melhor DX para animações React, bom tree-shaking
- **Zod** para validação: type-safe, integra com TypeScript
- **Resend** para emails: API moderna, free tier suficiente, melhor que EmailJS para server-side

## Escopo Excluído
- Blog / seção de notícias
- Internacionalização (i18n)
- E-commerce / pagamentos
- Sistema de comentários
- Analytics avançado (pode adicionar GA4 facilmente depois)
- Testes automatizados (pode adicionar Jest/Playwright em fase futura)

## Decisões das Considerações
1. **Markdown com preview** para fullDescription — usar `react-markdown` + `remark-gfm` para render, textarea com preview no admin
2. **yet-another-react-lightbox** para galeria fullscreen nas páginas de projeto
3. **ISR + generateStaticParams** para projetos — volume esperado < 100, abordagem ideal
