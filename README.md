# FindYourBabysitter

A modern babysitter matching platform built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up the database
cp .env.example .env
npx prisma migrate dev --name init

# 3. Seed with test data
npm run db:seed

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test Accounts

All accounts use password: `password123`

| Email | Role | Description |
|-------|------|-------------|
| admin@fyb.com | Admin | Platform admin |
| sarah@example.com | Parent | Has a booking with Emma |
| mike@example.com | Parent | Has a completed booking with review |
| emma@example.com | Babysitter | 5yr experience, CPR + First Aid |
| james@example.com | Babysitter | 3yr experience, First Aid |
| olivia@example.com | Babysitter | 8yr experience, CPR + First Aid |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite via Prisma ORM
- **Auth**: bcryptjs + JWT (httpOnly cookie)
- **Validation**: Zod

## Features

- Two-sided onboarding (Parent / Babysitter)
- Babysitter profiles with availability, certifications, and rates
- Childcare request posting with matching algorithm
- Booking lifecycle (pending -> accepted -> confirmed -> completed -> reviewed)
- In-app messaging (polling-based)
- Star ratings and reviews
- Admin panel with user management

## Project Structure

```
src/
  app/
    (auth)/          Login, Register
    (dashboard)/     Dashboard, Profile, Search, Requests, Bookings, Messages, Reviews
    (admin)/         Admin dashboard, User management
    api/             REST API routes
  components/
    ui/              Button, Input, Card, Badge, Modal, Avatar, StarRating, etc.
    layout/          Topbar, Sidebar, MobileNav
  lib/               Auth, session, prisma, matching algorithm, validators
  actions/           Server actions (auth, profile, booking, messages, reviews)
  hooks/             useCurrentUser, useMessages
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:seed      # Seed test data
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```
