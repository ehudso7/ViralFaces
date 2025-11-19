-- ViralFaces AI - Supabase Storage Setup
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Note: Storage buckets must be created via Dashboard or Supabase CLI
-- This script only handles the storage policies

-- Storage policies for 'faces' bucket
-- Allows anyone to upload and read face images

INSERT INTO storage.buckets (id, name, public)
VALUES ('faces', 'faces', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('results', 'results', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow anyone to upload to 'faces' bucket
CREATE POLICY "Allow public uploads to faces"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'faces');

-- Policy: Allow anyone to read from 'faces' bucket
CREATE POLICY "Allow public reads from faces"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'faces');

-- Policy: Allow anyone to delete from 'faces' bucket (for cleanup)
CREATE POLICY "Allow public deletes from faces"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'faces');

-- Policy: Allow anyone to upload to 'results' bucket
CREATE POLICY "Allow public uploads to results"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'results');

-- Policy: Allow anyone to read from 'results' bucket
CREATE POLICY "Allow public reads from results"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'results');

-- Policy: Allow anyone to delete from 'results' bucket (for cleanup)
CREATE POLICY "Allow public deletes from results"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'results');

-- Success! Your storage is now configured.
-- Note: These are PUBLIC policies for demo purposes.
-- For production, add user authentication and restrict by user_id.
