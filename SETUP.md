# Algorithm Visualizer - Setup Guide

This guide will help you set up the Algorithm Visualizer with Supabase authentication and Stripe payments.

## Prerequisites

- Node.js 18.17.0 or higher
- A Supabase account (https://supabase.com)
- A Stripe account (https://stripe.com)

## 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### Supabase Setup

1. Create a new project at https://supabase.com
2. Go to Project Settings > API
3. Copy the following values to your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep this secret!)

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Developers section:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your publishable key
   - `STRIPE_SECRET_KEY`: Your secret key
3. Set up a webhook endpoint:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## 2. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy the contents of supabase-schema.sql and run in Supabase SQL Editor
```

This will create:
- `profiles` table for user data
- `payments` table for payment records
- Row Level Security policies
- Triggers for automatic profile creation
- Admin user setup for codeslord@gmail.com

## 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

## 4. Admin User

The admin user (codeslord@gmail.com) needs to be created manually:

1. Sign up through the app with email: `codeslord@gmail.com`
2. Use password from `.env.local`: `ADMIN_PASSWORD`
3. The database trigger will automatically set `is_admin` and `has_paid` to TRUE
4. This user can access the visualizer without payment

## 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 6. Testing Payment Flow

For testing Stripe payments, use test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any CVC

## 7. Deployment

### Vercel Deployment (Recommended)

1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy!

### Update Stripe Webhook

After deployment, update your Stripe webhook URL to:
```
https://your-production-domain.com/api/stripe/webhook
```

## Features

- ✅ Landing page with pricing
- ✅ User authentication (Supabase)
- ✅ One-time £30 payment (Stripe)
- ✅ Protected visualizer access
- ✅ Admin user bypass
- ✅ Beautiful glassmorphic UI
- ✅ Lucide React icons

## Admin Access

Email: codeslord@gmail.com
Password: (Set in .env.local ADMIN_PASSWORD)

This account has automatic access without payment.

## Troubleshooting

### Supabase Connection Issues
- Verify your Supabase URL and keys
- Check if your database tables are created
- Ensure Row Level Security is enabled

### Stripe Payment Issues
- Verify webhook secret is correct
- Check Stripe dashboard for webhook delivery
- Ensure test mode is enabled for development

### Build Errors
- Run `npm install --legacy-peer-deps`
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

## Support

For issues, contact: codeslord@gmail.com
