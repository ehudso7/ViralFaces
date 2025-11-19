"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import VideoPlayer from "./VideoPlayer";

interface UploadFormProps {
  selectedTemplate?: string;
  onTemplateChange?: (templateId: string) => void;
}

export default function UploadForm({ selectedTemplate, onTemplateChange }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const templateId = selectedTemplate || "trump-dance";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Validate file
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    setLoading(true);
    setError(null);
    setResultUrl(null);
    setProgress(0);
    setProgressMessage("Preparing your upload...");

    try {
      // Initialize Supabase at runtime
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase configuration is missing. Please contact support.");
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const userId = uuidv4();
      const facePath = `${userId}/face.jpg`;

      // Upload face
      setProgress(10);
      setProgressMessage("Uploading your photo...");

      const { error: uploadError } = await supabase.storage
        .from("faces")
        .upload(facePath, file);

      if (uploadError) {
        // Provide helpful error message for bucket not found
        if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('bucket')) {
          throw new Error('Storage not configured. Please create Supabase storage buckets named "faces" and "results". See SETUP.md for instructions.');
        }
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      setProgress(30);
      setProgressMessage("Analyzing your face...");

      // Call server action to queue job
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facePath,
          templateId,
          userId,
          watermark: true
        }),
      });

      setProgress(50);
      setProgressMessage("Generating your viral video...");

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown API error', message: '' }));

        // Provide specific error messages
        if (res.status === 503 && errorData.error?.includes('Storage not configured')) {
          throw new Error('⚠️ Storage Setup Required: Please run the SQL script from SETUP.md in your Supabase dashboard to create storage buckets. This is a one-time setup step.');
        }

        if (res.status === 500) {
          throw new Error(`Server Error: ${errorData.message || errorData.error || 'Please check if all environment variables are configured correctly.'}`);
        }

        throw new Error(errorData.message || errorData.error || `API Error: ${res.status}`);
      }

      const data = await res.json();

      if (!data.videoUrl) {
        throw new Error("No video URL returned from API");
      }

      setProgress(90);
      setProgressMessage("Finalizing your video...");

      // Simulate final processing
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(100);
      setProgressMessage("Done! Your video is ready.");
      setResultUrl(data.videoUrl);
    } catch (error) {
      console.error("Error generating video:", error);
      setError(error instanceof Error ? error.message : "Failed to generate video. Please try again.");
      setProgress(0);
      setProgressMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTemplateId = e.target.value;
    if (onTemplateChange) {
      onTemplateChange(newTemplateId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-red-900/50 border border-red-500 text-red-200">
            {error}
          </div>
        )}

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-white file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-gradient-to-r file:from-pink-500 file:to-violet-500 hover:file:brightness-110"
            required
          />
        </div>

        <div>
          <label className="block text-xl mb-4">Select Template</label>
          <select
            value={templateId}
            onChange={handleTemplateChange}
            className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white text-lg"
          >
            <option value="trump-dance">Trump Victory Dance</option>
            <option value="elon-cybertruck">Elon in Cybertruck</option>
            <option value="taylor-eras">Taylor Swift Eras Tour</option>
            <option value="mrbeast-money">MrBeast Money Rain</option>
            <option value="rizz">Ohio Rizz Face</option>
            {/* Add 100+ more */}
          </select>
        </div>

        {loading && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>{progressMessage}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-6 text-2xl font-bold rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500 disabled:opacity-50"
        >
          {loading ? "Generating Magic... (30–90s)" : "Generate My Viral Video →"}
        </button>
      </form>

      {resultUrl && (
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            ✨ Your Viral Video is Ready!
          </h3>
          <VideoPlayer videoUrl={resultUrl} />
        </div>
      )}
    </div>
  );
}
