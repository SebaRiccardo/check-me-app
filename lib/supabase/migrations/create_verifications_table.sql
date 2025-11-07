-- Create verifications table
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS verifications_user_id_idx ON public.verifications(user_id);
CREATE INDEX IF NOT EXISTS verifications_category_idx ON public.verifications(category);
CREATE INDEX IF NOT EXISTS verifications_created_at_idx ON public.verifications(created_at DESC);
CREATE INDEX IF NOT EXISTS verifications_news_id_idx ON public.verifications(news_id);

-- Enable Row Level Security
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view verifications
CREATE POLICY "Verifications are viewable by everyone" 
  ON public.verifications 
  FOR SELECT 
  USING (true);

-- Policy: Users can insert their own verifications
CREATE POLICY "Users can insert their own verifications" 
  ON public.verifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own verifications
CREATE POLICY "Users can update their own verifications" 
  ON public.verifications 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own verifications
CREATE POLICY "Users can delete their own verifications" 
  ON public.verifications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for verification images
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-images', 'verification-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view verification images
CREATE POLICY "Anyone can view verification images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'verification-images');

-- Policy: Authenticated users can upload verification images
CREATE POLICY "Authenticated users can upload verification images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'verification-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Users can update their own verification images
CREATE POLICY "Users can update their own verification images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'verification-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own verification images
CREATE POLICY "Users can delete their own verification images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'verification-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_verifications_updated_at 
  BEFORE UPDATE ON public.verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
