"use client";

import { useState } from "react";
import type { Template } from "@/types";

interface TemplateGalleryProps {
  onSelect?: (templateId: string) => void;
  selectedId?: string;
}

const templates: Template[] = [
  { id: "trump-dance", title: "Trump Victory Dance", thumbnail: "/thumbs/trump.jpg" },
  { id: "elon-cybertruck", title: "Elon Cybertruck Flex", thumbnail: "/thumbs/elon.jpg" },
  { id: "taylor-eras", title: "Taylor Swift Eras Tour", thumbnail: "/thumbs/taylor.jpg" },
  { id: "mrbeast-money", title: "MrBeast Money Rain", thumbnail: "/thumbs/mrbeast.jpg" },
  { id: "rizz", title: "Ohio Rizz Face", thumbnail: "/thumbs/rizz.jpg" },
  // Add 100+ more
];

export default function TemplateGallery({ onSelect, selectedId }: TemplateGalleryProps) {
  const handleSelect = (templateId: string) => {
    if (onSelect) {
      onSelect(templateId);
      // Scroll to upload form
      const uploadSection = document.querySelector('form');
      uploadSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {templates.map((t) => (
        <div
          key={t.id}
          onClick={() => handleSelect(t.id)}
          className={`group cursor-pointer transition-all ${
            selectedId === t.id ? 'ring-4 ring-pink-500 rounded-2xl' : ''
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl aspect-video bg-gray-900">
            <img
              src={t.thumbnail}
              alt={t.title}
              className="w-full h-full object-cover group-hover:scale-110 transition"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect fill="%23111" width="400" height="225"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + encodeURIComponent(t.title) + '%3C/text%3E%3C/svg%3E';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
              <p className="text-lg font-bold">{t.title}</p>
            </div>
            {selectedId === t.id && (
              <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-2">
                <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
