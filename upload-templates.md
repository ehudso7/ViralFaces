# Template Video Upload Guide

This guide will help you upload template videos to your ViralFaces AI application.

## Overview

Template videos are the base videos that users' faces will be swapped into. Each template should be:
- **5-30 seconds long** for best results
- **MP4 format** with H.264 encoding
- **Clear facial features** visible in most frames
- **Good lighting** and minimal motion blur
- **Publicly accessible** via HTTPS

## Quick Start

### 1. Prepare Your Videos

Before uploading, make sure you have:
- `trump-dance.mp4` - Trump victory dance video
- `elon-cybertruck.mp4` - Elon in Cybertruck video
- `taylor-eras.mp4` - Taylor Swift Eras Tour video
- `mrbeast-money.mp4` - MrBeast money rain video
- `rizz.mp4` - Ohio rizz face video

⚠️ **Important**: Ensure you have the rights to use these videos. Using copyrighted content without permission may result in legal issues.

### 2. Upload to Supabase Storage

#### Method A: Using Supabase Dashboard (Easiest)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Create a new bucket if it doesn't exist:
   - Click **"New bucket"**
   - Name: `templates`
   - Public: **Yes** (required)
   - Click **"Create bucket"**

5. Upload your videos:
   - Click on the `templates` bucket
   - Click **"Upload file"**
   - Select your video files
   - Upload them one by one or in batch

6. Get the public URLs:
   - Click on each uploaded video
   - Copy the **Public URL** shown
   - It should look like: `https://your-project.supabase.co/storage/v1/object/public/templates/trump-dance.mp4`

#### Method B: Using Supabase CLI

If you prefer command-line:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Upload videos
supabase storage upload templates/trump-dance.mp4 ./path/to/trump-dance.mp4
supabase storage upload templates/elon-cybertruck.mp4 ./path/to/elon-cybertruck.mp4
supabase storage upload templates/taylor-eras.mp4 ./path/to/taylor-eras.mp4
supabase storage upload templates/mrbeast-money.mp4 ./path/to/mrbeast-money.mp4
supabase storage upload templates/rizz.mp4 ./path/to/rizz.mp4

# Get public URLs
supabase storage list templates
```

#### Method C: Using Node.js Script

Create a file `scripts/upload-templates.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const templates = [
  { id: 'trump-dance', file: './templates/trump-dance.mp4' },
  { id: 'elon-cybertruck', file: './templates/elon-cybertruck.mp4' },
  { id: 'taylor-eras', file: './templates/taylor-eras.mp4' },
  { id: 'mrbeast-money', file: './templates/mrbeast-money.mp4' },
  { id: 'rizz', file: './templates/rizz.mp4' },
];

async function uploadTemplates() {
  console.log('🚀 Starting template upload...\n');

  for (const template of templates) {
    try {
      console.log(`📤 Uploading ${template.id}...`);

      // Read file
      const fileBuffer = fs.readFileSync(template.file);

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('templates')
        .upload(`${template.id}.mp4`, fileBuffer, {
          contentType: 'video/mp4',
          upsert: true,
        });

      if (error) {
        console.error(`❌ Failed to upload ${template.id}:`, error.message);
        continue;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('templates')
        .getPublicUrl(`${template.id}.mp4`);

      console.log(`✅ Uploaded ${template.id}`);
      console.log(`   URL: ${publicUrlData.publicUrl}\n`);
    } catch (err) {
      console.error(`❌ Error processing ${template.id}:`, err.message);
    }
  }

  console.log('✨ Upload complete!\n');
  console.log('📝 Add these URLs to your .env.local:');
  console.log('');

  for (const template of templates) {
    const envVar = `TEMPLATE_${template.id.toUpperCase().replace(/-/g, '_')}_URL`;
    const url = `${supabaseUrl}/storage/v1/object/public/templates/${template.id}.mp4`;
    console.log(`${envVar}=${url}`);
  }
}

uploadTemplates().catch(console.error);
```

Run it:

```bash
# Place your video files in a ./templates/ directory
mkdir templates
# Copy your videos to ./templates/

# Install dependencies
npm install @supabase/supabase-js dotenv

# Run the script
node scripts/upload-templates.js
```

### 3. Configure Environment Variables

After uploading, add the URLs to your `.env.local` file:

```bash
TEMPLATE_TRUMP_DANCE_URL=https://your-project.supabase.co/storage/v1/object/public/templates/trump-dance.mp4
TEMPLATE_ELON_CYBERTRUCK_URL=https://your-project.supabase.co/storage/v1/object/public/templates/elon-cybertruck.mp4
TEMPLATE_TAYLOR_ERAS_URL=https://your-project.supabase.co/storage/v1/object/public/templates/taylor-eras.mp4
TEMPLATE_MRBEAST_MONEY_URL=https://your-project.supabase.co/storage/v1/object/public/templates/mrbeast-money.mp4
TEMPLATE_RIZZ_URL=https://your-project.supabase.co/storage/v1/object/public/templates/rizz.mp4
```

### 4. Restart Your Development Server

```bash
npm run dev
```

### 5. Test the Templates

1. Go to http://localhost:3000
2. Upload a test selfie
3. Select a template
4. Click "Generate My Viral Video"
5. Wait for the AI to process (30-90 seconds)
6. Your video should appear!

## Alternative: Using a CDN

If you prefer to use a different CDN:

### Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Upload your videos to your media library
3. Get the public URLs
4. Add them to `.env.local`

### AWS S3

1. Create an S3 bucket with public access
2. Upload your videos
3. Get the public URLs (format: `https://bucket-name.s3.region.amazonaws.com/video-name.mp4`)
4. Add them to `.env.local`

### Vercel Blob

1. Install Vercel Blob: `npm install @vercel/blob`
2. Upload videos via the Vercel dashboard or API
3. Get the public URLs
4. Add them to `.env.local`

## Finding Template Videos

### Stock Video Sites (Royalty-Free)

- [Pexels Videos](https://www.pexels.com/videos/) - Free stock videos
- [Pixabay Videos](https://pixabay.com/videos/) - Free stock videos
- [Coverr](https://coverr.co/) - Free stock footage
- [Videvo](https://www.videvo.net/) - Free stock video

### AI Video Generation

- [Runway Gen-2](https://runwayml.com/) - AI video generation
- [Pika Labs](https://pika.art/) - AI video generation
- [Stable Diffusion Video](https://stability.ai/) - AI video generation

### Creating Your Own

Use any video editing software:
- **Free**: DaVinci Resolve, OpenShot, Shotcut
- **Paid**: Adobe Premiere Pro, Final Cut Pro

Tips for creating template videos:
- Film in good lighting
- Keep the face clearly visible
- Avoid extreme angles
- Keep videos short (5-30 seconds)
- Export as MP4 with H.264 codec

## Troubleshooting

### "Template is not set up yet" Error

**Cause**: The environment variable for that template is not set.

**Solution**: 
1. Check that the video is uploaded and publicly accessible
2. Verify the URL in your `.env.local` file
3. Restart your dev server: `npm run dev`

### "Failed to fetch template video" Error

**Cause**: The video URL is not accessible or incorrect.

**Solution**:
1. Visit the URL in your browser to verify it works
2. Ensure the bucket is set to **Public**
3. Check for typos in the URL
4. Verify the video file exists in storage

### Video Upload Fails

**Cause**: File might be too large or bucket doesn't exist.

**Solution**:
1. Check video file size (keep under 100MB)
2. Verify the `templates` bucket exists in Supabase
3. Ensure bucket is set to **Public**
4. Check your Supabase storage quota

## Adding New Templates

To add a new template:

1. Upload the video file to your storage
2. Add a new environment variable in `.env.local`:
   ```bash
   TEMPLATE_YOUR_NEW_TEMPLATE_URL=https://...
   ```

3. Update the API route (`app/api/generate/route.ts`):
   ```typescript
   const VALID_TEMPLATES = [
     "trump-dance",
     "elon-cybertruck",
     "taylor-eras",
     "mrbeast-money",
     "rizz",
     "your-new-template", // Add your new template ID
   ];

   const templateVideos: Record<string, string> = {
     "trump-dance": process.env.TEMPLATE_TRUMP_DANCE_URL || "",
     // ... other templates ...
     "your-new-template": process.env.TEMPLATE_YOUR_NEW_TEMPLATE_URL || "",
   };
   ```

4. Add to the template gallery (`components/TemplateGallery.tsx`):
   ```typescript
   const templates: Template[] = [
     // ... existing templates ...
     { id: "your-new-template", title: "Your New Template", thumbnail: "/thumbs/your-new-template.svg" },
   ];
   ```

5. Add to the upload form dropdown (`components/UploadForm.tsx`):
   ```tsx
   <option value="your-new-template">Your New Template</option>
   ```

6. Create a thumbnail SVG in `public/thumbs/your-new-template.svg`

7. Restart your server and test!

---

**🎉 You're ready to start face swapping!**

For more help, see:
- [SETUP.md](./SETUP.md) - Full setup guide
- [README.md](./README.md) - Project overview
- [Supabase Docs](https://supabase.com/docs/guides/storage) - Storage documentation
