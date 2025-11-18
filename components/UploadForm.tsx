"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [templateId, setTemplateId] = useState<string>("trump-dance");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const userId = uuidv4();
      const facePath = `${userId}/face.jpg`;

      // Upload face
      const { error: uploadError } = await supabase.storage
        .from("faces")
        .upload(facePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'API error' }));
        throw new Error(`API Error: ${res.status} ${errorData.message || ''}`);
      }

      const data = await res.json();

      if (!data.videoUrl) {
        throw new Error("No video URL returned from API");
      }

      setResultUrl(data.videoUrl);
    } catch (error) {
      console.error("Error generating video:", error);
      setError(error instanceof Error ? error.message : "Failed to generate video. Please try again.");
    } finally {
      setLoading(false);
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
            onChange={(e) => setTemplateId(e.target.value)}
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

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-6 text-2xl font-bold rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500 disabled:opacity-50"
        >
          {loading ? "Generating Magic... (30–90s)" : "Generate My Viral Video →"}
        </button>
      </form>

      {resultUrl && (
        <div className="mt-12 text-center">
          <video controls className="rounded-2xl mx-auto max-w-full" src={resultUrl} />
          <p className="mt-6">
            <a href={resultUrl} className="text-pink-400 underline text-xl">Download HD</a> |
            <a href="/pricing" className="ml-4 text-violet-400 underline text-xl">Remove Watermark ($9)</a>
          </p>
        </div>
      )}
    </div>
  );
}
