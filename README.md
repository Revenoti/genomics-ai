# Functional Genomic Medicine AI Chat

<div align="center">
  <img src="client/public/logo2_1763479558697.png" alt="Functional Genomic Medicine Logo" width="200"/>
  
  <p><strong>AI-Powered Precision Medicine Consultation Platform</strong></p>
  
  <p>
    <a href="https://genomic-ai.io">Live Demo</a> •
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
- **💾 Database Persistence**: PostgreSQL support with automatic session restoration across page refreshes and server restarts
- **🔄 Session Memory**: Conversation history persists via localStorage (within browser session) and optionally to database (across server restarts)
- **🆕 New Chat Feature**: Start fresh conversations with confirmation dialog while preserving previous sessions in database
- **📋 Dynamic Lead Qualification**: Intelligent form triggering after 2-4 conversation exchanges to capture patient information
- **🎯 Smart Recommendations**: AI assistant provides personalized service recommendations with direct links to clinic scheduling
- **📱 Mobile Optimized**: Fully responsive design with 44px touch targets, optimized message input, and clean two-line footer address
- **📍 Professional Footer**: Clinic address and copyright information displayed on all pages with mobile-optimized formatting
- **🌐 SEO & Social Sharing**: Custom 1200x630px branded social media card with comprehensive Open Graph and Twitter Card meta tags for beautiful previews on Facebook, LinkedIn, Twitter, and WhatsApp

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
- **PostgreSQL** with Drizzle ORM for persistent data storage
- **neon-serverless** database driver with WebSocket support
- **Session Management** with localStorage and database persistence

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

### Recommended (for production)
- **PostgreSQL Database** (Supabase or any PostgreSQL provider) - Enables persistent session storage and conversation history across server restarts. Falls back to in-memory storage if not configured.
- **Supabase Account** with vector database setup (for enhanced RAG; uses fallback context if not configured)

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

# Database (Recommended - for persistent storage across server restarts)
# Omit to use in-memory storage (data lost on restart)
DATABASE_URL=postgresql://user:password@host:port/database
# Example Supabase format:
# DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
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

### Database Setup (Recommended for Production)

The application supports PostgreSQL (via Supabase or any PostgreSQL provider) for persistent storage of conversations, sessions, and lead data. **If DATABASE_URL is not provided, the application automatically falls back to in-memory storage** (data is lost on server restart).

**Database Schema:**
- `chat_sessions` - Tracks conversation sessions with turn counts and form submission status
- `messages` - Stores all chat messages with role, content, type, and timestamps (indexed on session_id)
- `leads` - Captures lead qualification form submissions

**Initialize the database:**

```bash
# Push schema to your PostgreSQL database
npm run db:push
```

This creates the necessary tables and indexes in your database. The application automatically:
- Creates new sessions with unique UUIDs
- Saves all messages to the database
- Restores conversation history on page refresh via localStorage sessionId
- Persists form state to prevent data loss on refresh

**Note**: If you modify the database schema in `shared/schema.ts`, run `npm run db:push` again to sync the changes to your database.

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

## Deployment

### Netlify Deployment

This application is configured for easy deployment to Netlify with serverless functions.

#### Prerequisites
- [Netlify account](https://www.netlify.com/)
- GitHub repository (or GitLab/Bitbucket)

#### Quick Deploy

1. **Connect your repository to Netlify**
   - Log in to Netlify
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select this repository

2. **Configure build settings** (auto-configured via `netlify.toml`)
   - Build command: `npm install && npm run build`
   - Publish directory: `dist/public`
   - Functions directory: `netlify/functions`

3. **Set environment variables** in Netlify dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url (optional)
   SUPABASE_ANON_KEY=your_supabase_anon_key (optional)
   SESSION_SECRET=your_random_secret_string
   DATABASE_URL=your_postgresql_connection_string (recommended)
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - Your site will be live at `https://your-site-name.netlify.app`

5. **Configure custom domain** (optional)
   - Go to "Domain settings" in Netlify
   - Add your custom domain (e.g., `genomic-ai.io`)
   - Update DNS records as instructed
   - SSL certificate is automatically provisioned

#### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod
```

#### Important Notes

- **Environment Variables**: All required secrets must be set in Netlify's environment variables UI
- **Database**: Highly recommended to set `DATABASE_URL` for production to enable persistent session storage
- **Supabase**: Optional - falls back to built-in context if not configured
- **Custom Domain**: Update Open Graph URLs in `client/index.html` to match your domain
- **Build Time**: First build may take 2-3 minutes; subsequent builds are faster with caching

### Alternative: Replit Deployment

This application can also be deployed directly on Replit:

1. Import repository to Replit
2. Set environment variables in Secrets
3. Click "Run" - application starts on port 5000
4. Use Replit's built-in deployment for production

## Project Structure

```
├── client/                    # Frontend application
│   ├── public/               # Static assets
│   │   ├── logo2_1763479558697.png
│   │   └── social/          # Social media cards
│   │       └── og-card.png  # Open Graph card (1200x630px)
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── chat/        # Chat-specific components
│   │   │   │   ├── MessageInput.tsx    # Message input with send button
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   └── DynamicFormMessage.tsx
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── Footer.tsx   # Footer with address and copyright
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ImageCarousel.tsx
│   │   │   └── IntriguingQuestions.tsx
│   │   ├── contexts/        # React Context providers
│   │   │   └── ChatContext.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and helpers
│   │   ├── pages/           # Page components
│   │   │   ├── landing.tsx  # Landing page with footer
│   │   │   └── chat.tsx     # Chat interface with New Chat button and footer
│   │   ├── index.css        # Global styles and theme
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template with SEO meta tags
│
├── server/                   # Backend application
│   ├── routes.ts            # API endpoints
│   ├── storage.ts           # Storage interface (DatabaseStorage/MemStorage)
│   ├── db.ts                # Database connection (neon-serverless)
│   ├── supabase.ts          # Supabase RAG integration
│   ├── openai.ts            # OpenAI client configuration
│   ├── system-prompt.ts     # AI system prompt and form logic
│   ├── index.ts             # Express server setup
│   └── vite.ts              # Vite SSR configuration
│
├── shared/                   # Shared types and schemas
│   └── schema.ts            # Drizzle schemas and Zod validation
│
├── attached_assets/          # User-uploaded assets
│   └── service_images/      # Carousel images
│
├── netlify/                  # Netlify deployment
│   └── functions/           # Serverless functions
│       └── index.ts         # API handler for Netlify
│
├── netlify.toml             # Netlify configuration
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

### `GET /api/sessions/:sessionId/messages`

Fetch message history for a session (used for conversation restoration).

**Response:**
```json
{
  "sessionId": "uuid-string",
  "turnCount": 3,
  "formSubmitted": false,
  "messages": [
    {
      "id": "message-uuid",
      "role": "user",
      "content": "Message content",
      "type": "message",
      "timestamp": "2025-11-18T16:00:00Z"
    }
  ]
}
```

### `POST /api/leads`

Submit lead qualification form.

**Request Body:**
```json
{
  "sessionId": "uuid-string",
  "fullName": "Patient Name",
  "email": "patient@example.com",
  "consultationFor": "myself",
  "primaryHealthConcern": "Health concern description",
  "triedOtherTreatments": "yes"
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
- **Database Persistence**: Messages and sessions optionally stored in PostgreSQL (when DATABASE_URL is set)
- **Session Restoration**: Conversation history automatically restored on page refresh via localStorage and database
- **New Chat Button**: PlusCircle icon button in header to start fresh conversations
  - Confirmation dialog prevents accidental resets
  - Clears localStorage session ID and resets chat state
  - Previous conversations preserved in database for analytics
  - Success toast notification confirms new session
- **Form State Persistence**: Lead qualification form visibility preserved across page refreshes (localStorage)
- **Turn Tracking**: Intelligent turn counting for form triggering (3-5 exchanges)
- **Form Integration**: Dynamic form appears after conversation engagement or strong interest signals
- **Mobile Optimized**: Compact layout with 32px avatars, send button on right side, and 2-row message input

**Session Flow (with DATABASE_URL configured):**
1. User starts chat → Server creates session with UUID
2. SessionId saved to browser localStorage (`genomic-ai-session-id`)
3. All messages persist to PostgreSQL database
4. On page refresh → SessionId loaded from localStorage
5. Message history fetched from `/api/sessions/:sessionId/messages`
6. Full conversation restored seamlessly

**Session Flow (without DATABASE_URL - in-memory mode):**
1. User starts chat → Server creates session in memory
2. SessionId saved to browser localStorage
3. Messages stored in memory (lost on server restart)
4. On page refresh → Conversation lost if server restarted

### Footer
- **Contact Information**: Clinic address displayed prominently on all pages
  - Address format (two lines for mobile readability):
    - Line 1: 1217 Sovereign Row suite 107
    - Line 2: Oklahoma City, OK 73108
  - MapPin icon for visual clarity
- **Copyright Notice**: "© 2025 Functional Genomic AI. All rights Reserved."
- **Responsive Design**: Clean centered layout optimized for mobile and desktop
- **Professional Styling**: Semi-transparent card background with subtle backdrop blur
- **Consistent Placement**: Appears on both landing page and chat interface

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
   - **DATABASE_URL is strongly recommended** - Without it, data is lost on server restarts
   - Configure Supabase connection pooling for scale
   - Monitor database connection health (pool limits, error logging)

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

## Recent Updates

### November 2025

**New Chat Feature**
- Added "New Chat" button (PlusCircle icon) to chat header
- Confirmation dialog prevents accidental session resets
- Dialog message: "Your current conversation session will be cleared. You can start fresh with a new session."
- Clears localStorage session ID and resets chat state to welcome message
- Previous conversations preserved in database for analytics
- Success toast notification confirms new session started

**Footer Component**
- Professional footer added to both landing and chat pages
- Contact information:
  - Address displayed on two lines for mobile readability:
    - Line 1: 1217 Sovereign Row suite 107
    - Line 2: Oklahoma City, OK 73108
  - MapPin icon for visual clarity
- Copyright notice: "© 2025 Functional Genomic AI. All rights Reserved."
- Semi-transparent card background with backdrop blur
- Centered layout optimized for mobile and desktop

**UI Improvements**
- Fixed message input send button position from left to right (standard chat UI pattern)
- Changed from absolute positioning to flex layout for better responsiveness
- Send button now uses `flex-shrink-0` to maintain size
- Improved mobile footer formatting with clean two-line address display

**Deployment & Social Sharing**
- Updated custom domain from genomic-ai.com to **genomic-ai.io** across all meta tags
- **Created custom 1200x630px branded Open Graph card** for social media sharing
  - Professional blue-cyan gradient background matching app design
  - DNA helix branding with clinic name and tagline
  - Optimized for Facebook, LinkedIn, Twitter, and WhatsApp previews
  - Stored at `client/public/social/og-card.png`
- Configured comprehensive Open Graph and Twitter Card meta tags
- Added `og:image:type` and `og:image:secure_url` for enhanced compatibility
- Created `netlify.toml` with serverless functions, redirects, and security headers
- Added Netlify serverless function wrapper in `netlify/functions/index.ts`
- Comprehensive Netlify deployment documentation in README
- One-click deployment ready with environment variable configuration
- Automatic SSL certificate provisioning for custom domains

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
    <a href="https://genomic-ai.io">Visit Live Application</a>
  </p>
</div>
