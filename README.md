# ViralFaces AI 🎭✨

Transform yourself into viral sensations! Upload a selfie, pick a template, and get an ultra-realistic face-swapped video in seconds.

## Features

- 🎥 **AI-Powered Face Swapping** - LivePortrait integration via Replicate API
- 🎨 **Template Gallery** - Choose from trending viral moments
- 💳 **Stripe Payments** - Remove watermarks with one-time purchases
- 📊 **Real-time Progress** - Watch your video generate step-by-step
- 🔒 **Secure Storage** - Supabase for file storage and signed URLs
- ⚡ **Next.js 15** - Latest React Server Components
- 🎯 **TypeScript** - Full type safety

## Tech Stack

- **Framework**: Next.js 15.5.6
- **Styling**: Tailwind CSS
- **Database/Storage**: Supabase
- **Payments**: Stripe
- **AI**: Replicate (LivePortrait model)
- **Analytics**: Vercel Analytics
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Stripe account
- Replicate API token

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Replicate
REPLICATE_API_TOKEN=r8_...

# Template videos (host these MP4s on Supabase storage or any CDN)
TEMPLATE_TRUMP_DANCE_URL=https://cdn.yoursite.com/templates/trump-dance.mp4
TEMPLATE_ELON_CYBERTRUCK_URL=https://cdn.yoursite.com/templates/elon-cybertruck.mp4
TEMPLATE_TAYLOR_ERAS_URL=https://cdn.yoursite.com/templates/taylor-eras.mp4
TEMPLATE_MRBEAST_MONEY_URL=https://cdn.yoursite.com/templates/mrbeast-money.mp4
TEMPLATE_RIZZ_URL=https://cdn.yoursite.com/templates/rizz.mp4
```

> **Tip:** You can create a `templates` bucket in Supabase Storage, upload each MP4, make it public, and paste the public URLs above. Any HTTPS-accessible CDN works too.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ViralFaces.git
cd ViralFaces
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase storage buckets:
   - Create a `faces` bucket for user uploads
   - Create a `results` bucket for generated videos
   - Configure Row Level Security (RLS) policies

4. Create Stripe products:
   - Go to Stripe Dashboard → Products
   - Create a product for "HD Video - No Watermark"
   - Copy the price ID and replace `price_1XYZ123` in `app/pricing/page.tsx`

5. Set up Stripe webhooks:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy webhook secret to `.env.local`

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
ViralFaces/
├── app/
│   ├── api/
│   │   ├── generate/          # Video generation API
│   │   └── webhooks/stripe/   # Stripe webhook handler
│   ├── pricing/               # Pricing page
│   ├── success/               # Post-checkout success page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── globals.css            # Global styles
│   └── not-found.tsx          # 404 page
├── components/
│   ├── UploadForm.tsx         # File upload + generation
│   └── TemplateGallery.tsx    # Template selection
├── types/
│   └── index.ts               # TypeScript type definitions
├── public/
│   └── thumbs/                # Template thumbnails
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## API Routes

### POST /api/generate

Generates a face-swapped video.

**Request Body:**
```json
{
  "facePath": "userId/face.jpg",
  "templateId": "trump-dance",
  "userId": "uuid-v4",
  "watermark": true
}
```

**Response:**
```json
{
  "videoUrl": "https://signed-url...",
  "resultId": "uuid-v4",
  "templateId": "trump-dance"
}
```

### POST /api/webhooks/stripe

Handles Stripe webhook events for payment processing.

## Security Features

- ✅ Environment variable validation
- ✅ Input validation & sanitization
- ✅ Path traversal prevention
- ✅ File type & size validation
- ✅ Template ID whitelist
- ✅ Comprehensive error handling
- ✅ Signed URLs with expiration
- ✅ Unique filenames (race condition prevention)

## Known Limitations & TODOs

### Critical (Implement Before Production)
- [ ] **Authentication** - No user auth system (anyone can use API)
- [ ] **Async Processing** - Replicate API is called synchronously (will timeout)
- [ ] **Template URLs** - Hardcoded URLs don't exist (need CDN hosting)
- [ ] **Rate Limiting** - No rate limits on API endpoints

### Recommended
- [ ] User dashboard for video history
- [ ] Email notifications for completed videos
- [ ] Database for tracking users and purchases
- [ ] Admin panel for template management
- [ ] Social sharing integration
- [ ] Video download with proper filename

### Nice to Have
- [ ] Thumbnail generation for templates
- [ ] Video preview before purchase
- [ ] Subscription plans
- [ ] Referral system
- [ ] Advanced editing options

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Stripe Webhook Setup (Production)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# For production
# Add https://yourdomain.com/api/webhooks/stripe in Stripe Dashboard
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/ViralFaces/issues)
- Email: support@viralfaces.ai

## Acknowledgments

- [LivePortrait](https://github.com/KwaiVGI/LivePortrait) for the face-swapping model
- [Replicate](https://replicate.com) for AI model hosting
- [Supabase](https://supabase.com) for backend infrastructure
- [Stripe](https://stripe.com) for payment processing

---

**Made with ❤️ by the ViralFaces Team**
