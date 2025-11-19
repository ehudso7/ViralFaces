# ViralFaces AI - 5-Minute Quickstart 🚀

The **fastest** way to get ViralFaces running.

## Option 1: Copy-Paste Setup (Recommended - 2 minutes)

### Step 1: Run SQL Script

1. Go to your Supabase project: https://app.supabase.com
2. Click **SQL Editor** in the sidebar
3. Click **New query**
4. Copy and paste the entire contents of `supabase-setup.sql`
5. Click **Run**
6. Done! ✅

### Step 2: Get Environment Variables

Still in Supabase:

1. Go to **Settings** → **API**
2. Copy these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
```

### Step 3: Add to Vercel

1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Add the 3 Supabase variables above
3. Add these Stripe/Replicate variables (get from their dashboards):

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
REPLICATE_API_TOKEN=r8_...
```

4. **Redeploy** your project

### Step 4: Test!

1. Go to your deployed app
2. Upload a selfie
3. Generate a video
4. It works! 🎉

---

## Option 2: Automated Setup with CLI (3 minutes)

If you have Supabase CLI installed:

```bash
# Make script executable
chmod +x supabase-setup.sh

# Run it
./supabase-setup.sh
```

Follow the prompts and you're done!

---

## Option 3: Manual Dashboard Setup (5 minutes)

If you prefer clicking buttons:

### Create Buckets

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name: `faces`, Public: Off, Max file size: 10MB
4. Click **Create bucket**
5. Repeat for `results` bucket (Max: 100MB)

### Create Policies

1. Click on `faces` bucket → **Policies** → **New policy**
2. Template: **Allow public access**
3. Operations: SELECT, INSERT, DELETE
4. Click **Save**
5. Repeat for `results` bucket

---

## Verify Setup

Check that everything works:

```bash
# Buckets should exist
https://app.supabase.com/project/YOUR_PROJECT/storage/buckets

# Should see:
# - faces
# - results
```

---

## Get API Keys

### Supabase
- Dashboard → Settings → API
- Copy: Project URL, anon key, service_role key

### Stripe
- https://dashboard.stripe.com/test/apikeys
- Copy: Publishable key, Secret key
- Create webhook: Developers → Webhooks
- Copy: Webhook secret

### Replicate
- https://replicate.com/account/api-tokens
- Create token
- Copy: API token

---

## Troubleshooting

**"Bucket not found"**
→ Run `supabase-setup.sql` in SQL Editor

**"Storage not configured"**
→ Check buckets exist in Storage tab

**"Payment system not configured"**
→ Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to Vercel env vars

**"Server configuration error"**
→ Check all env vars are set in Vercel
→ Redeploy after adding env vars

---

## Production Checklist

Before going live:

- [ ] Replace test Stripe keys with live keys
- [ ] Add real Stripe price ID in `app/pricing/page.tsx`
- [ ] Set up Stripe webhook with production URL
- [ ] Add Replicate billing/credits
- [ ] Test full payment flow
- [ ] Add real template video URLs
- [ ] Consider adding user authentication
- [ ] Set up monitoring/error tracking

---

**That's it! You're ready to create viral videos! 🎬**

For detailed setup, see [SETUP.md](SETUP.md)
