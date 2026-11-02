# SaaS NoteApp

A multi-tenant note-taking SaaS application built with Next.js 14, Supabase, Prisma, Kinde Auth, and Stripe. Features a subscription-based monetization model with custom feature gating.

## Preview
<p align="center">
  <img src="https://res.cloudinary.com/da5ggxk01/image/upload/v1730450907/e060a763-6a49-4f82-8140-6691a486effe.png" alt="SaaS NoteApp Preview" width="100%">
</p>

## Architecture & Features

- **Feature Gating & Subscriptions:** Hard limit of 5 notes for free-tier users. Integrated Stripe Checkout for premium tier upgrades and Stripe Customer Portal for self-serve subscription management.
- **Authentication:** Route protection and session management handled via Kinde Auth.
- **Data Management:** Full CRUD operations for notes, isolated by user scope.
- **Performance Optimization:** Utilizes Next.js 14 App Router with Server-Side Rendering (SSR) and Cache Revalidation to keep data synchronized without client-side lag.
- **UI & Layout:** Responsive interface built with Tailwind CSS and Shadcn UI.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Authentication:** Kinde Auth
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Payments:** Stripe
- **Styling:** Tailwind CSS & Shadcn UI
- **Deployment:** Vercel

## Local Development Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/kyyril/saas-noteapp.git](https://github.com/kyyril/saas-noteapp.git)
cd saas-noteapp

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Environment Variables

Create a `.env` file in the root directory and populate it with the following keys:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

KINDE_CLIENT_ID="..."
KINDE_CLIENT_SECRET="..."
KINDE_ISSUER_URL="https://..."
NEXT_PUBLIC_KINDE_REDIRECT_URL="http://localhost:3000/api/auth/success"
NEXT_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"

STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_ID_PREMIUM="price_..."

```

### 4. Database Migration

```bash
npx prisma db push

```

### 5. Start Development Server

```bash
npm run dev

```

Open `http://localhost:3000` in your browser.

## Database Schema

* **User:** Stores user identity mapped from Kinde and Stripe customer/subscription identifiers.
* **Note:** Stores note payload (`title`, `description`) linked to a user ID.

```

```
