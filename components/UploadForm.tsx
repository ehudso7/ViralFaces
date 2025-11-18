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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const userId = uuidv4();
    const facePath = `${userId}/face.jpg`;

    // Upload face
    await supabase.storage.from("faces").upload(facePath, file);

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

    const data = await res.json();
    setResultUrl(data.videoUrl);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
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
