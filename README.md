# SaaS Application with Next.js, Stripe, Kinde, Prisma, Supabase, and Tailwind

This project is a SaaS application built with a modern tech stack including Next.js 14, Stripe for payments, Kinde for authentication, Prisma for database management, Supabase for backend functionality, and Tailwind CSS for styling. The application allows users to subscribe to premium services and manage their notes.

## Features

- 🌐 **Next.js App Router**: Utilizes the new Next.js 14 App Router for routing and page organization.
- 🔐 **Kinde Authentication**: Secure login and authentication with Kinde.
- 📧 **Passwordless Authentication**: Users can log in via email with no need for passwords.
- 🔑 **OAuth Support**: Easy login with Google and GitHub integrations.
- 💿 **Supabase Database**: Uses Supabase as the primary database for user data and notes.
- 💨 **Prisma ORM**: Prisma ORM handles database interactions and ensures smooth data modeling.
- 🎨 **Tailwind CSS & Shadcn UI**: Styled with Tailwind CSS and Shadcn UI components, with customizable color schemes.
- 💵 **Stripe for Subscriptions**: Handles payments and subscriptions for premium features.
- 🪝 **Stripe Webhooks**: Webhooks are set up for automated Stripe event handling.
- 😶‍🌫️ **Deployment to Vercel**: Deployed on Vercel for scalability and performance.

## Pending Features

- Cache Revalidation
- Stripe Customer Portal
- Stripe Checkout Page
- Server-side Implementation
- CRUD for Notes (Add, View, Edit, Delete Notes)

## Tech Stack

- **Next.js**: [https://nextjs.org](https://nextjs.org)
- **Kinde**: [https://dub.sh/xeU8r3v](https://dub.sh/xeU8r3v)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)
- **Shadcn/UI**: [https://ui.shadcn.com](https://ui.shadcn.com)
- **Stripe**: [https://stripe.com](https://stripe.com)
- **Prisma**: [https://prisma.io](https://prisma.io)
- **Supabase**: [https://supabase.com](https://supabase.com)

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables for Stripe, Kinde, Supabase, and other services.
4. Run the development server using `npm run dev`.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
