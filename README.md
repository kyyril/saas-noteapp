# NotesApp

NotesApp is a full-stack SaaS note-taking application where users can create, organize, and manage daily notes. It uses a freemium business model: users can create up to 5 notes for free, after which they can upgrade to a monthly subscription via Stripe to unlock unlimited notes.

Behind the scenes, the application is built with security and data isolation in mind, featuring field-level encryption for note contents, server-side quota checks, and audit logging.

---

## Preview

<p align="center">
  <img src="https://res.cloudinary.com/da5ggxk01/image/upload/v1730450907/e060a763-6a49-4f82-8140-6691a486effe.png" alt="SaaS NoteApp Preview" width="100%">
</p>

---

## Product Features

* **Note Management (CRUD)**: Create, view, edit, and delete notes from a central dashboard.
* **Freemium Tier & Stripe Payments**: Free tier allows up to 5 notes. When the limit is reached, users can subscribe via Stripe Checkout to get unlimited notes.
* **Customer Billing Portal**: Subscribed users can manage or cancel their subscription directly through the integrated Stripe Customer Portal.
* **Authentication**: User registration and login handled through Kinde Auth (social logins and email).
* **Theme Customization**: Built-in support for dark and light modes, plus custom profile accent colors (Orange, Blue, Green, Violet, Red, Rose, Yellow).
* **Automatic Data Encryption**: Note contents are automatically encrypted before being saved to the database, ensuring personal notes remain private.

---

## How It Works (User Flow)

```mermaid
flowchart TD
    A[Visit Homepage] --> B[Sign Up or Log In via Kinde]
    B --> C[Access Dashboard]
    C --> D{Note Quota Status}
    D -->|Under 5 Notes| E[Create and Edit Notes Freely]
    D -->|5 Notes Reached on Free Plan| F[Prompt to Upgrade via Stripe]
    F --> G[Stripe Checkout Page]
    G -->|Payment Success| H[Unlimited Notes Activated]
    H --> E
    C --> I[Settings: Change Theme Color or View Account]
```

1. **Authentication**: New users sign up and existing users log in using Kinde Auth.
2. **Dashboard**: Users land on their dashboard showing all their created notes, along with the date each note was created.
3. **Creating Notes**: Users can click "Create a new Note", type a title and description, and save it.
4. **Subscription Gate**: Once a free user creates 5 notes, the "Create" button prompts them to subscribe on the Billings page.
5. **Billing Management**: After subscribing, users get unlimited note creation and can open the Stripe Customer Portal anytime to manage their subscription.

---

## Technical Architecture & Security (Under the Hood)

For technical reviews and interviews, the application includes several backend engineering patterns:

```mermaid
flowchart TD
    Client[Browser Client]
    Kinde[Kinde Auth]
    Server[Next.js Server Actions]
    Crypto[AES-256-GCM Cipher]
    DB[(PostgreSQL via Prisma)]
    Stripe[Stripe Infrastructure]

    Client -->|Session Auth| Kinde
    Client -->|Form Actions| Server
    Server -->|Encrypt / Decrypt| Crypto
    Server -->|Scoped Queries| DB
    Server -->|Checkout Sessions| Stripe
    Stripe -->|Webhooks| Server
```

### Key Technical Implementations

1. **Field-Level Encryption at Rest**:
   Note descriptions are encrypted before being written to PostgreSQL using AES-256-GCM (96-bit random IV, authentication tag). The server decrypts the note in-memory only when requested by the authenticated owner.

2. **Multi-Tenant Data Isolation (IDOR Prevention)**:
   All database queries for reading, updating, or deleting notes enforce tenant boundaries by matching both `id` and `userId`. A user cannot access or delete another user's note by guessing the note ID.

3. **Server-Side Quota Verification**:
   The 5-note free tier limit is enforced directly inside the Next.js Server Action with database checks, preventing client-side bypasses.

4. **Idempotent Webhook Processing**:
   Stripe webhook events (`checkout.session.completed`, `invoice.payment_succeeded`) are checked against a `WebhookEvent` table before processing. If Stripe retries a webhook, duplicate processing is prevented.

5. **Audit Logging**:
   Mutations (creating, updating, deleting notes, profile changes, and subscription events) record an entry in the `AuditLog` table with user ID, action type, IP address, and timestamp.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 14 (App Router, Server Actions, Server Components) |
| Language | TypeScript |
| Database & ORM | PostgreSQL (Supabase / Neon) + Prisma ORM |
| Authentication | Kinde Auth (`@kinde-oss/kinde-auth-nextjs`) |
| Payments | Stripe API, Stripe Checkout, Stripe Customer Portal |
| Validation | Zod |
| Cryptography | Node.js standard `crypto` module (AES-256-GCM) |
| Styling & UI | Tailwind CSS, Radix UI primitives, Lucide Icons, `next-themes` |

---

## Database Models

The Prisma schema defines five tables:

* `User`: Stores user ID, email, Stripe customer ID, and color scheme preference.
* `Notes`: Stores note title, encrypted description, creation timestamp, and foreign key to `User`.
* `Subscription`: Stores Stripe subscription ID, status, plan ID, billing interval, and user relation.
* `AuditLog`: Records events (`NOTE_CREATED`, `NOTE_DELETED`, `SUBSCRIPTION_CREATED`, etc.) with IP and timestamp.
* `WebhookEvent`: Stores processed Stripe event IDs to ensure idempotent webhook handling.

---

## Environment Configuration

Create a `.env` file in the project root:

```env
# Kinde Authentication
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=https://your-domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# PostgreSQL Database
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRODUCTION_URL=http://localhost:3000

# Encryption Key (32-byte hex string / 64 characters)
ENCRYPTION_KEY=0dc4ad24945d65d31882f428ea3359ea8539dcd5567764e0ce5c855946284e73
```

A template without secrets is available in `.env.example`.

---

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Push Database Schema
```bash
npx prisma db push
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Start the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build Verification

To verify production build and type-checking:

```bash
npm run build
```

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
