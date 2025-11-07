-- ============================================
-- QUICK SETUP GUIDE FOR VERIFICATIONS FEATURE
-- ============================================
-- 
-- Run this in Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste & Run
--
-- This will:
-- 1. Create verifications table
-- 2. Set up RLS policies
-- 3. Create storage bucket
-- 4. Configure storage policies
-- 5. Add indexes for performance
-- ============================================

-- Step 1: Create verifications table
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  news_id TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS verifications_user_id_idx ON public.verifications(user_id);
CREATE INDEX IF NOT EXISTS verifications_category_idx ON public.verifications(category);
CREATE INDEX IF NOT EXISTS verifications_created_at_idx ON public.verifications(created_at DESC);
CREATE INDEX IF NOT EXISTS verifications_news_id_idx ON public.verifications(news_id);

-- Step 3: Enable RLS
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies for verifications table
CREATE POLICY "Anyone can view verifications" 
  ON public.verifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create verifications" 
  ON public.verifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verifications" 
  ON public.verifications 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own verifications" 
  ON public.verifications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Step 5: Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-images', 'verification-images', true)
ON CONFLICT (id) DO NOTHING;

-- Step 6: Create storage policies
CREATE POLICY "Anyone can view verification images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'verification-images');

CREATE POLICY "Authenticated users can upload verification images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'verification-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own verification images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'verification-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own verification images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'verification-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Step 7: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 8: Create trigger
CREATE TRIGGER update_verifications_updated_at 
  BEFORE UPDATE ON public.verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION COMPLETE!
-- ============================================
-- 
-- ✅ Table created: public.verifications
-- ✅ Indexes added for performance
-- ✅ RLS enabled with policies
-- ✅ Storage bucket: verification-images
-- ✅ Storage policies configured
-- ✅ Auto-update trigger for updated_at
--
-- Next steps:
-- 1. Go to Storage → Buckets → verify "verification-images" exists
-- 2. Test by creating a verification in the app
-- 3. Check Table Editor → verifications for new rows
-- ============================================
