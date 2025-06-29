# Seatwell - Sports Ticket Marketplace

## Overview

Seatwell is a full-stack web application that serves as a marketplace for buying and selling sports tickets, specifically focused on Swiss hockey games. The platform connects season ticket holders who cannot attend specific games with fans looking to purchase tickets. It features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React SPA with TypeScript, built using Vite
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Library**: Built on shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for sports theme
- **State Management**: TanStack Query handles all server state, local state managed with React hooks
- **Routing**: Wouter provides lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **API Structure**: RESTful API with Express.js
- **Database Layer**: Drizzle ORM with PostgreSQL, supporting both production and in-memory storage for development
- **Authentication**: Simple email/password authentication (OAuth-style authentication mentioned for club integration)
- **Session Management**: Basic session handling (production would use proper session management)

### Database Schema
The application uses four main entities:
- **Users**: Manages buyers, sellers, and admins with different user types
- **Games**: Stores hockey game information (teams, dates, venues, status)
- **Tickets**: Handles ticket listings with pricing, seating, and status tracking
- **Transactions**: Records purchase transactions between users

## Data Flow

1. **User Authentication**: Users log in through club credentials to access season tickets
2. **Ticket Listing**: Sellers select games they cannot attend and list their tickets
3. **Ticket Discovery**: Buyers browse available games and select seats
4. **Purchase Flow**: Buyers purchase tickets through a modal-based checkout process
5. **Transaction Recording**: All purchases are recorded in the transactions table
6. **Admin Management**: Admins can view all tickets, games, and transactions through a dedicated interface

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **react-hook-form**: Form state management

### UI Dependencies
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **vite**: Build tool and development server

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: Uses `npm run dev` with tsx for hot reloading
- **Production Build**: Vite builds client assets, esbuild bundles server code
- **Runtime**: Node.js with ES modules support
- **Database**: PostgreSQL 16 module enabled in Replit environment
- **Port Configuration**: Server runs on port 5000, mapped to external port 80

The build process creates optimized bundles in the `dist` directory, with client assets served statically and server code bundled for Node.js execution.

## Recent Changes

### June 24, 2025 - Full Dark Mode & Background System
- **Complete Dark Mode Implementation**: Black background across all pages with proper contrast
- **Dual Background System**: Separate configurable backgrounds for homepage (image) and global (black)
- **Enhanced Background Configuration**: Admin panel with tabs for global and homepage background settings
- **Dark Navigation**: Updated navbar and footer with white/gray text on dark background
- **Fixed Admin CRUD**: Resolved schema import issues - game creation/editing/deletion now fully functional
- **Background Wrapper**: Applied consistent theming across all pages including sell-ticket page
- **Easy Background Switching**: Simple config changes for gradient/image/solid backgrounds

### June 21, 2025 - Major Enhancement Update
- **Modern Background Design**: Implemented configurable gradient background system
- **Language Switcher**: Added UI-only language selector with German, French, Italian, English
- **Enhanced Homepage**: Added About Us and FAQ sections with configurable content
- **Admin Authentication**: Secured admin panel with email/password protection (seatwell@seatwell.ch / ourstartup)
- **Improved Seat Selection**: Created realistic Vaudoise Arena layout with multi-seat selection
- **Enhanced Purchase Flow**: Added comprehensive checkout with payment fields and address collection
- **Game Management**: Full admin CRUD operations for games with image upload simulation
- **Chronological Ordering**: Games now display in chronological order (soonest first)
- **Content Management**: Editable content system for all user-facing text
- **Data Security Messaging**: Added reassuring security statements throughout flows

### June 21, 2025 - Initial Setup
- Basic prototype structure with buy/sell ticket flows
- Admin panel foundation
- Mock authentication system

## User Preferences

```
Preferred communication style: Simple, everyday language.
```