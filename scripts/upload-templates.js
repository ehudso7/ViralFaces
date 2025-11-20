#!/usr/bin/env node

/**
 * Template Video Upload Script
 * 
 * This script uploads template videos to Supabase Storage.
 * 
 * Usage:
 *   1. Place your video files in a ./templates/ directory
 *   2. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *   3. Run: node scripts/upload-templates.js
 * 
 * Requirements:
 *   - @supabase/supabase-js
 *   - dotenv
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
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

async function checkBucket() {
  const { data, error } = await supabase.storage.getBucket('templates');
  
  if (error) {
    console.error('❌ Templates bucket does not exist.');
    console.error('   Please create a public "templates" bucket in Supabase Storage.');
    console.error('   Dashboard: https://app.supabase.com → Storage → New bucket');
    return false;
  }
  
  if (!data.public) {
    console.warn('⚠️  Templates bucket is not public.');
    console.warn('   Videos may not be accessible. Consider making the bucket public.');
  }
  
  return true;
}

async function uploadTemplates() {
  console.log('🚀 ViralFaces Template Upload Script\n');
  
  // Check if bucket exists
  const bucketExists = await checkBucket();
  if (!bucketExists) {
    process.exit(1);
  }
  
  console.log('📦 Checking template files...\n');
  
  // Check which files exist
  const existingFiles = [];
  const missingFiles = [];
  
  for (const template of templates) {
    if (fs.existsSync(template.file)) {
      const stats = fs.statSync(template.file);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      existingFiles.push({ ...template, size: sizeMB });
      console.log(`✅ Found: ${template.id}.mp4 (${sizeMB} MB)`);
    } else {
      missingFiles.push(template);
      console.log(`❌ Missing: ${template.file}`);
    }
  }
  
  if (missingFiles.length > 0) {
    console.warn('\n⚠️  Some template files are missing.');
    console.warn('   See upload-templates.md for guidance on finding/creating template videos.');
  }
  
  if (existingFiles.length === 0) {
    console.error('\n❌ No template files found.');
    console.error('   Please add video files to ./templates/ directory.');
    process.exit(1);
  }
  
  console.log(`\n📤 Uploading ${existingFiles.length} template(s)...\n`);
  
  const uploadedUrls = [];
  
  for (const template of existingFiles) {
    try {
      console.log(`   Uploading ${template.id}... (${template.size} MB)`);
      
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
        console.error(`   ❌ Failed: ${error.message}`);
        continue;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('templates')
        .getPublicUrl(`${template.id}.mp4`);
      
      const envVar = `TEMPLATE_${template.id.toUpperCase().replace(/-/g, '_')}_URL`;
      uploadedUrls.push({ envVar, url: publicUrlData.publicUrl });
      
      console.log(`   ✅ Uploaded successfully`);
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
  }
  
  if (uploadedUrls.length === 0) {
    console.error('\n❌ No templates were uploaded successfully.');
    process.exit(1);
  }
  
  console.log('\n✨ Upload complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Add these URLs to your .env.local file:\n');
  
  for (const { envVar, url } of uploadedUrls) {
    console.log(`${envVar}=${url}`);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🎉 Next steps:');
  console.log('   1. Copy the URLs above to your .env.local file');
  console.log('   2. Restart your development server: npm run dev');
  console.log('   3. Test video generation at http://localhost:3000');
  console.log('\nFor production:');
  console.log('   - Add these environment variables to Vercel');
  console.log('   - Settings → Environment Variables → Add each variable');
  console.log('   - Redeploy your application\n');
}

// Run the upload
uploadTemplates().catch((err) => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
