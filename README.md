# Functional Genomic Medicine AI Chat

<div align="center">
  <img src="client/public/logo2_1763479558697.png" alt="Functional Genomic Medicine Logo" width="200"/>
  
  <p><strong>AI-Powered Precision Medicine Consultation Platform</strong></p>
  
  <p>
    <a href="https://genomic-ai.com">Live Demo</a> •
    <a href="https://functionalgenomicmedicine.com">Clinic Website</a>
  </p>
</div>

---

## Overview

A sophisticated AI-powered chat interface that serves as an intelligent consultation platform for Functional Genomic Medicine clinic. The application combines a visually engaging landing page with an advanced conversational AI system powered by OpenAI GPT-5 and Supabase RAG (Retrieval-Augmented Generation) to provide personalized health consultations and lead qualification.

### Key Features

- **🎨 Engaging Landing Page**: Animated service carousel with 6 rotating images (4-second auto-rotate, pause-on-hover) and floating intriguing questions with fade animations
- **🤖 AI-Powered Consultation**: ChatGPT-style interface with streaming responses powered by OpenAI GPT-5
- **📚 RAG Knowledge Base**: Supabase vector database integration for contextual responses about clinic services, research, and the Posey Protocol
- **📋 Dynamic Lead Qualification**: Intelligent form triggering after 2-4 conversation exchanges to capture patient information
- **🎯 Smart Recommendations**: AI assistant provides personalized service recommendations with direct links to clinic scheduling
- **📱 Mobile Optimized**: Fully responsive design with 44px touch targets and optimized layouts
- **🌐 SEO & Social Sharing**: Comprehensive Open Graph and Twitter Card meta tags for optimal social media presence

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development and builds
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS** with shadcn/ui component library
- **Framer Motion** for animations
- **React Hook Form** + Zod for form validation

### Backend
- **Express.js** with TypeScript
- **OpenAI SDK** for GPT-5 integration
- **Supabase** for RAG vector database
- **Drizzle ORM** for type-safe database operations
- **Session Management** with in-memory storage (production-ready for PostgreSQL)

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for backend bundling
- **PostCSS** with Autoprefixer
- **Lucide React** for icons

## Prerequisites

### Required
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **OpenAI API Key** (GPT-5 access)

### Optional
- **Supabase Account** with vector database setup (for enhanced RAG; uses fallback context if not configured)
- **PostgreSQL** (for production database persistence; uses in-memory storage by default)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (Optional - omit to use fallback context)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Session Secret (Optional)
SESSION_SECRET=your_secure_session_secret_here

# Database (Optional - for production persistence)
DATABASE_URL=postgresql://user:password@host:port/database
```

### Supabase Setup (Optional)

**Note**: Supabase is optional. If not configured, the application automatically falls back to built-in context about clinic services, the Posey Protocol, and treatment offerings. This allows the app to run immediately with just the OpenAI API key.

For enhanced RAG capabilities with your own knowledge base, set up a Supabase database with a `documents` table:

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB
);

-- Create an index for vector similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);
```

The application probes the Supabase schema on boot and gracefully handles missing tables or configuration.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/genomic-ai-chat.git
   cd genomic-ai-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5000
   ```

## Project Structure

```
├── client/                    # Frontend application
│   ├── public/               # Static assets
│   │   └── logo2_1763479558697.png
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── chat/        # Chat-specific components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ImageCarousel.tsx
│   │   │   └── IntriguingQuestions.tsx
│   │   ├── contexts/        # React Context providers
│   │   │   └── ChatContext.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and helpers
│   │   ├── pages/           # Page components
│   │   │   ├── landing.tsx
│   │   │   └── chat.tsx
│   │   ├── index.css        # Global styles and theme
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template with SEO meta tags
│
├── server/                   # Backend application
│   ├── routes.ts            # API endpoints
│   ├── storage.ts           # Storage interface (in-memory/database)
│   ├── supabase.ts          # Supabase RAG integration
│   ├── index.ts             # Express server setup
│   └── vite.ts              # Vite SSR configuration
│
├── shared/                   # Shared types and schemas
│   └── schema.ts            # Drizzle schemas and Zod validation
│
├── attached_assets/          # User-uploaded assets
│   └── service_images/      # Carousel images
│
└── README.md                # This file
```

## API Documentation

### `POST /api/chat`

Main chat endpoint with streaming support.

**Request Body:**
```json
{
  "sessionId": "uuid-string-or-null",
  "message": "User message content",
  "messages": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "AI response" }
  ]
}
```

**Response:**
- **Streaming Response**: Server-Sent Events (SSE) format
  ```
  data: {"content": "AI response chunk", "sessionId": "uuid"}
  data: {"done": true}
  ```
- **Form Trigger Response**: JSON when form should be displayed
  ```json
  {
    "type": "form",
    "sessionId": "uuid",
    "message": "Form prompt message"
  }
  ```

### `POST /api/leads`

Submit lead qualification form.

**Request Body:**
```json
{
  "sessionId": "uuid-string",
  "name": "Patient Name",
  "email": "patient@example.com",
  "consultationTarget": "For myself",
  "primaryConcern": "Health concern description",
  "previousTreatments": "Treatment history"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you message",
  "leadId": "uuid"
}
```

## Features in Detail

### Landing Page
- **Gradient Background**: Professional blue-cyan gradient (HSL 195°, 60%)
- **Service Carousel**: 6 rotating service images with smooth transitions
- **Floating Questions**: Animated questions that fade in/out to engage visitors
- **Responsive Logo**: Clinic logo (48px mobile, 64px desktop) in top-left corner

### Chat Interface
- **Real-time Streaming**: Token-by-token response streaming for natural conversation flow
- **Context Awareness**: RAG system retrieves relevant clinic information from Supabase
- **Session Management**: Persistent conversation tracking with turn counting
- **Form Integration**: Dynamic form appears after 3-5 exchanges or strong interest signals
- **Mobile Optimized**: Compact layout with 32px avatars and 2-row message input

### AI System Prompt
The assistant operates with a dual role:
- **50% Medical Consultant**: Provides information about genomic medicine, Posey Protocol, and clinic services
- **50% Sales Advisor**: Guides potential patients toward scheduling consultations

## Color Scheme

The application uses a professional healthcare-focused blue-cyan color palette:

- **Primary**: HSL(195, 60%, 38%) in light mode / HSL(195, 60%, 48%) in dark mode
- **Gradients**: Dark blue to lighter blue-cyan
- **Typography**: Inter for body text, Sora for headings

## Deployment

### Replit Deployment (Current)
The application is configured for Replit with:
- Custom domain: `genomic-ai.com`
- Automatic workflow restart on file changes
- Environment secrets management

### Production Deployment
For production deployment:

1. **Database Migration**
   ```bash
   npm run db:push
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Start production server**
   ```bash
   npm start
   ```

4. **Environment Variables**
   - Ensure all environment variables are set on your hosting platform
   - Use PostgreSQL for production database
   - Configure Supabase connection pooling for scale

### Recommended Hosting Platforms
- **Replit** (current setup)
- **Vercel** (with Serverless Functions)
- **Railway** (for full-stack deployment)
- **Render** (with PostgreSQL add-on)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code style
   - Add TypeScript types
   - Update documentation as needed
4. **Test your changes**
   ```bash
   npm run dev
   ```
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Code Style
- TypeScript for type safety
- Functional React components with hooks
- Tailwind CSS for styling (no custom CSS unless necessary)
- ESLint and Prettier for code formatting

## License

Copyright © 2025 Functional Genomic Medicine. All rights reserved.

This project is proprietary software. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

## Support

For questions or support:
- **Clinic Website**: [functionalgenomicmedicine.com](https://functionalgenomicmedicine.com)
- **Contact**: [Contact Form](https://functionalgenomicmedicine.com/contact-us/)

## Acknowledgments

- **OpenAI** for GPT-5 API
- **Supabase** for vector database and RAG capabilities
- **shadcn/ui** for beautiful, accessible UI components
- **Radix UI** for primitive components
- **Tailwind CSS** for utility-first styling

---

<div align="center">
  <p>Built with ❤️ for Functional Genomic Medicine</p>
  <p>
    <a href="https://genomic-ai.com">Visit Live Application</a>
  </p>
</div>
