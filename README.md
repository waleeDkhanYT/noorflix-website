# Noorflix - Entertainment Database & Discovery Platform

A modern full-stack web application for browsing, discovering, and exploring movies, TV shows, web series, and anime. Noorflix provides a centralized streaming media database with an intuitive user interface built with Next.js and powered by Supabase.

## 🎬 Overview

Noorflix is a comprehensive entertainment database platform that aggregates content across multiple media categories. The application fetches metadata from TMDB (The Movie Database) and stores content information in a PostgreSQL database via Supabase, offering users a seamless browsing and discovery experience.

### Key Features
- **Multi-Category Support**: Browse movies, TV shows, web series, and anime
- **Trending Content**: Discover trending titles across all categories
- **Popular Picks**: Curated popular content recommendations
- **Real-Time Updates**: Live database synchronization via Supabase
- **Responsive Design**: Mobile-first responsive UI with dark mode support
- **Fast Performance**: Server-side rendering and static generation with Next.js
- **Secure**: Content Security Policy headers and CORS protection

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.2.9](https://nextjs.org) - React framework with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org) - Type-safe development
- **Styling**: 
  - [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS framework
  - [Material-UI (MUI) 9](https://mui.com) - Component library with icons
- **Animations**: [Framer Motion 12](https://www.framer.com/motion) - Smooth UI animations
- **State Management**: [Redux Toolkit 2.12](https://redux-toolkit.js.org) with React-Redux
- **Icons**: [Lucide React 1.20](https://lucide.dev) - Beautiful icon library

### Backend & Database
- **Database**: [Supabase](https://supabase.com) - PostgreSQL with real-time capabilities
- **Authentication**: Supabase Auth with SSR support
- **Database Query Tool**: [sqlc](https://sqlc.dev) - Type-safe SQL query generation

### HTTP & Utilities
- **HTTP Client**: [Axios 1.18](https://axios-http.com) - Promise-based HTTP client
- **Data Validation**: [Zod 4.4](https://zod.dev) - TypeScript-first schema validation
- **UI Utilities**: 
  - [clsx 2.1](https://github.com/lukeed/clsx) - Conditional CSS class names
  - [Tailwind Merge 3.6](https://github.com/dcastil/tailwind-merge) - Tailwind CSS class conflict resolver
- **Toast Notifications**: [Sonner 2.0](https://sonner.emilkowal.ski) - Toast notification library
- **Theme Management**: [next-themes 0.4](https://github.com/pacocoursey/next-themes) - Dark mode support
- **Server-only**: [server-only 0.0.1](https://www.npmjs.com/package/server-only) - Prevent client-side imports

## 📁 Project Structure

```
app/                          Next.js App Router
├── page.tsx                   Home page with content sections
├── layout.tsx                 Root layout with providers
├── (auth)/                    Authentication pages
├── movie/[id]/                Movie detail pages
├── tv/[id]/                   TV show detail pages
└── anime/[id]/                Anime detail pages

components/
├── home/
│   ├── HeroSection.tsx        Hero banner with featured content
│   ├── TrendingSection.tsx    Trending titles carousel
│   ├── PopularMoviesSection.tsx    Popular movies
│   ├── PopularTVSection.tsx   Popular TV shows
│   └── AnimeSpotlightSection.tsx  Anime highlights
├── ui/                        Reusable UI components
├── navigation/                Navigation components
└── layout/                    Layout wrapper components

lib/
├── api/                       API client utilities
├── services/                  Business logic services
├── hooks/                     Custom React hooks
├── types/                     TypeScript type definitions
├── utils/                     Helper utilities
└── store/                     Redux store configuration

supabase/
├── migrations/                Database schema migrations
├── seed.sql                   Database seeding scripts
└── types/                     Auto-generated Supabase types

public/                        Static assets (images, fonts)
styles/                        Global CSS and theme

.github/
└── workflows/                 GitHub Actions CI/CD
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- TMDB API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/waleeDkhanYT/noorflix-website.git
cd noorflix-website
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

# Optional: Cloudinary for image optimization
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build & Production

**Build the application:**
```bash
npm run build
```

**Run production server:**
```bash
npm start
```

**Linting:**
```bash
npm run lint
```

## 📊 Database Schema

The application uses PostgreSQL (via Supabase) with the following main tables:

- **movies** - Movie metadata and details
- **tv_shows** - TV series information
- **anime** - Anime content database
- **users** - User profiles and authentication
- **watchlist** - User watchlist entries
- **ratings** - User ratings and reviews

Database migrations are in `supabase/migrations/` with PL/pgSQL procedures for complex operations.

## 🔌 API Integration

### External APIs
- **TMDB API**: Fetches movie, TV, and entertainment metadata
- **Supabase REST API**: CRUD operations on content database
- **Supabase Realtime**: WebSocket connections for live updates

### Internal API Routes
Located in `app/api/` for backend operations:
- Content search and filtering
- User authentication endpoints
- Watchlist management
- Rating operations

## 🔒 Security Features

The application implements several security best practices:

- **Content Security Policy (CSP)**: Strict CSP headers configured in `next.config.ts`
- **CORS Protection**: Restricted cross-origin requests
- **Clickjacking Protection**: X-Frame-Options set to DENY
- **XSS Prevention**: Proper content type headers
- **DNS Prefetch Control**: Controlled DNS prefetch behavior
- **Server-only Code**: Enforced separation of server and client code

## 🎨 Styling & Theme

- **Tailwind CSS**: Utility-first approach with PostCSS
- **Material-UI Components**: Rich, accessible component library
- **Dark Mode**: Automatic theme switching with next-themes
- **Responsive Design**: Mobile-first responsive breakpoints
- **Custom Typography**: Optimized with next/font (Geist)

## 🔄 State Management

Redux Toolkit manages global state for:
- User authentication and profile
- Search and filter preferences
- Watchlist items
- Theme preferences
- Loading and error states

## 📱 Responsive Breakpoints

The application uses Tailwind CSS breakpoints:
- **sm** (640px) - Small devices
- **md** (768px) - Tablets
- **lg** (1024px) - Large tablets
- **xl** (1280px) - Desktops

## 🚀 Deployment

The application is optimized for deployment on [Vercel](https://vercel.com):

```bash
npm run build
vercel deploy
```

Environment variables should be configured in your deployment platform's settings.

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint code quality checks

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private. All rights reserved.

## 👨‍💻 Author

**Waleed Khan** - [@waleeDkhanYT](https://github.com/waleeDkhanYT)

## 🙋 Support

For support, open an issue on the [GitHub Issues](https://github.com/waleeDkhanYT/noorflix-website/issues) page.

---

**Happy browsing! 🎬🍿**
