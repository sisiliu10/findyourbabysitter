# Berlin Babysitter

A full-stack marketplace connecting parents with verified babysitters in Berlin. Built with Next.js, PostgreSQL, and a focus on trust and simplicity.

**Live:** [berlinbabysitter.com](https://berlinbabysitter.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (React 19, TypeScript) |
| Database | PostgreSQL (Neon) with Prisma ORM |
| Auth | JWT + httpOnly cookies, bcrypt password hashing |
| Validation | Zod schema validation |
| Styling | Tailwind CSS 4, custom component library |
| Maps | Google Places Autocomplete API |
| Hosting | Vercel (serverless) |
| Fonts | DM Sans, Instrument Serif |

---

## Features

### Authentication & Onboarding
- Email/password registration with role selection (Parent or Babysitter)
- Multi-step onboarding tailored to each role
- Address autocomplete powered by Google Places API (restricted to Germany)
- Profile picture upload stored as base64
- JWT session management with 7-day expiry

### For Parents
- Browse and filter babysitter profiles by city, rate, and certifications
- Create childcare requests with date, time, children details, and budget
- Automatic sitter matching based on a scoring algorithm (location, availability, age range, certifications, budget)
- Book sitters and manage booking lifecycle (Pending > Accepted > Confirmed > Completed)
- Leave reviews after completed bookings
- In-app messaging with booked sitters

### For Babysitters
- Public profile with bio, hourly rate, languages, age range, and availability grid
- Weekly availability scheduler (morning / afternoon / evening per day)
- Browse parent requests and respond to bookings
- In-app messaging with parents
- Profile editing with photo upload

### Matching Algorithm
Sitters are scored against each request using multiple factors:
- Same city (+30 pts)
- Within travel radius via Haversine distance (+20 pts)
- Available at requested day/time (+25 pts)
- Comfortable with children's age range (+15 pts)
- Within parent's budget (+10 pts)
- 3+ years experience (+5 pts)
- CPR / First Aid certified (+3 pts each)

### Messaging
- Per-booking conversation threads
- Unread message tracking with badges
- Auto-mark as read on view

### Admin
- Dashboard with stats (users, bookings, reviews, active sitters)
- User management with pagination

---

## Database Schema

```
User
├── id, email, passwordHash, role (PARENT / BABYSITTER / ADMIN)
├── firstName, lastName, phone, avatarUrl
├── isDisabled, onboarded
└── timestamps

BabysitterProfile
├── userId (FK → User)
├── bio, hourlyRate, currency (EUR)
├── city, state, zipCode, latitude, longitude, radiusMiles
├── availabilityJson (weekly grid)
├── yearsExperience, languages, certifications
├── ageRangeMin, ageRangeMax
├── hasFirstAid, hasCPR, hasTransportation
└── isActive

ChildcareRequest
├── parentId (FK → User)
├── title, description, dateNeeded, startTime, endTime
├── childrenJson, numberOfChildren
├── city, state, zipCode, latitude, longitude
├── maxHourlyRate, specialNotes
└── status (OPEN / MATCHED / CLOSED)

Booking
├── requestId (FK), parentId (FK), sitterId (FK)
├── dateBooked, startTime, endTime
├── agreedRate, totalEstimated
├── status (PENDING → ACCEPTED → CONFIRMED → COMPLETED)
└── declinedReason, cancelledBy, cancelledReason

Message
├── bookingId (FK), senderId (FK)
├── content, isRead
└── createdAt

Review
├── bookingId (FK, unique), authorId (FK), subjectId (FK)
├── rating (1-5), title, comment
└── isVisible
```

---

## API Endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Authenticate |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/profile` | Get own profile |
| PUT | `/api/profile` | Update profile |
| POST | `/api/profile/avatar` | Upload avatar |
| GET | `/api/sitters` | Search sitters (filterable) |
| GET | `/api/sitters/[id]` | Sitter detail + reviews |
| GET | `/api/requests/[id]/matches` | Find matching sitters |
| PATCH | `/api/bookings/[id]/status` | Update booking status |
| GET | `/api/messages/[conversationId]` | Fetch messages |
| POST | `/api/messages/[conversationId]` | Send message |
| GET | `/api/admin/stats` | Admin dashboard stats |
| GET | `/api/admin/users` | List all users |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (auth)/                     # Login & register pages
│   ├── (dashboard)/                # Authenticated pages
│   │   ├── dashboard/              # Main dashboard
│   │   ├── onboarding/             # Multi-step onboarding
│   │   ├── search/                 # Browse sitters
│   │   ├── sitter/[id]/            # Sitter public profile
│   │   ├── profile/                # Own profile (view & edit)
│   │   ├── requests/               # Childcare requests (list, new, detail)
│   │   ├── bookings/               # Booking management
│   │   ├── messages/               # Messaging
│   │   └── admin/                  # Admin panel
│   └── api/                        # REST API routes
├── components/
│   ├── layout/                     # Topbar, Sidebar, MobileNav
│   └── ui/                         # Badge, Button, Input, Modal, Toast, etc.
├── hooks/                          # useCurrentUser
├── lib/                            # Auth, session, prisma, matching, utils, validators
├── actions/                        # Server actions (auth, requests)
└── types/                          # TypeScript interfaces
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add: DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Seed demo data
npx tsx prisma/seed.ts

# Start dev server
npm run dev
```

---

## Deployment

Hosted on Vercel with automatic deployments from the `main` branch. Database on Neon (serverless PostgreSQL). Custom domain: berlinbabysitter.com.

Environment variables required in Vercel:
- `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING`
- `JWT_SECRET`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
