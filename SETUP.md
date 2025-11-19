# ViralFaces AI - Setup Guide

This guide will walk you through setting up ViralFaces AI from scratch.

## Table of Contents
1. [Supabase Setup](#supabase-setup)
2. [Stripe Setup](#stripe-setup)
3. [Replicate Setup](#replicate-setup)
4. [Environment Variables](#environment-variables)
5. [Deployment](#deployment)

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: ViralFaces
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project"

### Step 2: Create Storage Buckets

#### Create "faces" Bucket

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Enter bucket name: `faces`
4. Set as **Public** or **Private** (recommended: Private)
5. Click **"Create bucket"**

#### Create "results" Bucket

1. Click **"New bucket"** again
2. Enter bucket name: `results`
3. Set as **Public** or **Private** (recommended: Private)
4. Click **"Create bucket"**

### Step 3: Configure Storage Policies

#### For "faces" bucket:

1. Click on the `faces` bucket
2. Go to **Policies** tab
3. Click **"New policy"**
4. Choose **"Allow public access"** (or create custom policy)
5. Add policy for INSERT:

```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'faces');
```

6. Add policy for SELECT:

```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'faces');
```

#### For "results" bucket:

Repeat the same process for the `results` bucket:

```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'results');

CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'results');
```

### Step 4: Get Supabase Credentials

1. Go to **Project Settings** (gear icon)
2. Go to **API** section
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

---

## Stripe Setup

### Step 1: Create Stripe Account

1. Go to [Stripe](https://stripe.com)
2. Sign up for an account
3. Complete account verification

### Step 2: Get API Keys

1. Go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY` (⚠️ Keep secret!)

### Step 3: Create Product

1. Go to **Products** → **Add product**
2. Fill in:
   - **Name**: HD Video - No Watermark
   - **Description**: Remove watermark from your viral video
   - **Price**: $9.00 (or your price)
   - **Payment type**: One-time
3. Click **Save product**
4. Copy the **Price ID** (starts with `price_...`)
5. Replace `price_1XYZ123` in `app/pricing/page.tsx` with your real price ID

### Step 4: Set Up Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL:
   - For local testing: Use [Stripe CLI](https://stripe.com/docs/stripe-cli)
   - For production: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

#### Local Webhook Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Replicate Setup

### Step 1: Create Replicate Account

1. Go to [Replicate](https://replicate.com)
2. Sign up for an account

### Step 2: Get API Token

1. Go to your [Account Settings](https://replicate.com/account/api-tokens)
2. Click **Create token**
3. Copy the token → `REPLICATE_API_TOKEN`

### Step 3: Add Credits

⚠️ **Important**: The LivePortrait model costs approximately **$0.05-0.10 per generation**

1. Go to [Billing](https://replicate.com/account/billing)
2. Add payment method
3. Add credits to your account

---

## Template Videos Setup

⚠️ **CRITICAL**: Template videos are required for the face-swap to work!

### Step 1: Prepare Template Videos

You need to upload actual video files for each template:
- Trump Victory Dance
- Elon Cybertruck Flex
- Taylor Swift Eras Tour
- MrBeast Money Rain
- Ohio Rizz Face

**Video Requirements:**
- Format: MP4
- Duration: 5-30 seconds recommended
- Resolution: 720p or 1080p
- Contains a visible face for swapping

### Step 2: Upload to Supabase Storage (Recommended)

1. Go to Supabase → **Storage**
2. Create a new public bucket named `templates`
3. Upload your template videos:
   - `trump-dance.mp4`
   - `elon-cybertruck.mp4`
   - `taylor-eras.mp4`
   - `mrbeast-money.mp4`
   - `rizz.mp4`
4. Get the public URLs for each video
5. Add the URLs to your environment variables (see below)

### Step 3: Alternative - Use CDN

Alternatively, you can host template videos on any CDN:
- Cloudflare R2
- AWS S3 with CloudFront
- Vercel Blob Storage
- Any public HTTPS URL

**Important**: URLs must be publicly accessible via HTTPS

### Step 4: Add Template URLs to Environment Variables

Add these to your `.env.local` or Vercel environment variables:

```bash
TEMPLATE_TRUMP_DANCE_URL=https://your-supabase-project.supabase.co/storage/v1/object/public/templates/trump-dance.mp4
TEMPLATE_ELON_URL=https://your-supabase-project.supabase.co/storage/v1/object/public/templates/elon-cybertruck.mp4
TEMPLATE_TAYLOR_URL=https://your-supabase-project.supabase.co/storage/v1/object/public/templates/taylor-eras.mp4
TEMPLATE_MRBEAST_URL=https://your-supabase-project.supabase.co/storage/v1/object/public/templates/mrbeast-money.mp4
TEMPLATE_RIZZ_URL=https://your-supabase-project.supabase.co/storage/v1/object/public/templates/rizz.mp4
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Replicate
REPLICATE_API_TOKEN=r8_...

# Template Videos (REQUIRED)
TEMPLATE_TRUMP_DANCE_URL=https://...
TEMPLATE_ELON_URL=https://...
TEMPLATE_TAYLOR_URL=https://...
TEMPLATE_MRBEAST_URL=https://...
TEMPLATE_RIZZ_URL=https://...
```

### For Vercel Deployment

1. Go to your Vercel project
2. Go to **Settings** → **Environment Variables**
3. Add all the above variables
4. Make sure to add them for all environments (Production, Preview, Development)

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com)

3. Click **Import Project**

4. Select your GitHub repository

5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

6. Add all environment variables (see above)

7. Click **Deploy**

8. Once deployed, update Stripe webhook URL to your production domain

### Post-Deployment Checklist

- [ ] Supabase buckets created (`faces` and `results`)
- [ ] Storage policies configured
- [ ] Stripe product created with correct price ID
- [ ] Stripe webhook endpoint added with production URL
- [ ] All environment variables added to Vercel
- [ ] Test upload with a real selfie
- [ ] Test payment flow (use Stripe test card: 4242 4242 4242 4242)
- [ ] Verify webhook events are received

---

## Testing

### Test Card Numbers (Stripe)

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0027 6000 3184

### Test Video Generation

1. Upload a clear selfie (JPEG/PNG, < 10MB)
2. Select a template
3. Click "Generate My Viral Video"
4. Wait 30-60 seconds for processing
5. Video should appear with watermark
6. Test payment to remove watermark

---

## Troubleshooting

### "Bucket not found" Error

**Problem**: Supabase storage buckets don't exist

**Solution**:
1. Go to Supabase → Storage
2. Create `faces` and `results` buckets
3. Configure storage policies (see [Step 3](#step-3-configure-storage-policies))

### "Payment system is not configured" Error

**Problem**: Missing Stripe publishable key

**Solution**:
1. Check `.env.local` has `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. If deploying to Vercel, add it in Environment Variables
3. Redeploy

### "Server configuration error" (500)

**Problem**: Missing environment variables at runtime

**Solution**:
1. Check all required env vars are set
2. For Vercel, go to Settings → Environment Variables
3. Ensure variables are set for the correct environment
4. Redeploy

### "Template video not configured" Error

**Problem**: Template video URLs not set in environment variables

**Solution**:
1. Upload template videos to Supabase storage or CDN
2. Get public URLs for each video
3. Add template URLs to environment variables:
   ```
   TEMPLATE_TRUMP_DANCE_URL=https://...
   TEMPLATE_ELON_URL=https://...
   TEMPLATE_TAYLOR_URL=https://...
   TEMPLATE_MRBEAST_URL=https://...
   TEMPLATE_RIZZ_URL=https://...
   ```
4. Restart your development server or redeploy

### "Template video not accessible" Error

**Problem**: Template video URL is not publicly accessible

**Solution**:
1. Verify the URL is correct and publicly accessible
2. If using Supabase storage, ensure the bucket is public
3. Test the URL in a browser - you should be able to download the video
4. Check CORS settings if using external CDN

### Video generation timeout

**Problem**: Replicate API call takes too long

**Solution**:
- Replicate processing takes 30-90 seconds
- For production, implement async processing with webhooks
- See `README.md` "Known Limitations" section

---

## Support

If you encounter issues:

1. Check this setup guide carefully
2. Review error messages in browser console
3. Check Vercel deployment logs
4. Verify all environment variables are correct
5. Create an issue on GitHub

---

## Next Steps

After successful setup:

1. Replace placeholder template thumbnails with real images
2. Add actual template video URLs (currently hardcoded)
3. Implement user authentication
4. Set up async video processing
5. Add rate limiting
6. Create user dashboard

See `README.md` for full feature roadmap.

---

**🎉 You're all set! Start creating viral videos!**
