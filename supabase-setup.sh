#!/bin/bash

# ViralFaces AI - Automated Supabase Setup Script
# This script creates storage buckets and policies using Supabase CLI

echo "🚀 Setting up Supabase for ViralFaces AI..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    echo ""
    echo "Run one of these commands first:"
    echo ""
    echo "  macOS/Linux:"
    echo "    brew install supabase/tap/supabase"
    echo ""
    echo "  npm:"
    echo "    npm install -g supabase"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check if logged in
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase."
    echo "Run: supabase login"
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Prompt for project ref
echo "📋 Enter your Supabase Project Reference ID:"
echo "   (Find it at: https://app.supabase.com/project/YOUR_PROJECT/settings/general)"
read -p "Project Ref: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project ref is required"
    exit 1
fi

echo ""
echo "🗂️  Creating storage buckets..."

# Link to project
supabase link --project-ref "$PROJECT_REF"

# Create 'faces' bucket using SQL
echo "Creating 'faces' bucket..."
supabase db execute "
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('faces', 'faces', false, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;
"

# Create 'results' bucket using SQL
echo "Creating 'results' bucket..."
supabase db execute "
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('results', 'results', false, 104857600, ARRAY['video/mp4'])
ON CONFLICT (id) DO NOTHING;
"

echo ""
echo "🔒 Setting up storage policies..."

# Apply storage policies
supabase db execute "$(cat supabase-setup.sql)"

echo ""
echo "✅ Supabase setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Verify buckets exist: https://app.supabase.com/project/$PROJECT_REF/storage/buckets"
echo "   2. Add environment variables to Vercel (if not done already)"
echo "   3. Test the app!"
echo ""
