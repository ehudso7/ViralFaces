"use client";

const templates = [
  { id: "trump-dance", name: "Trump Victory Dance", thumbnail: "/templates/trump-dance.jpg" },
  { id: "elon-cybertruck", name: "Elon in Cybertruck", thumbnail: "/templates/elon-cybertruck.jpg" },
  { id: "taylor-eras", name: "Taylor Swift Eras Tour", thumbnail: "/templates/taylor-eras.jpg" },
  { id: "mrbeast-money", name: "MrBeast Money Rain", thumbnail: "/templates/mrbeast-money.jpg" },
  { id: "rizz", name: "Ohio Rizz Face", thumbnail: "/templates/rizz.jpg" },
];

export default function TemplateGallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {templates.map((template) => (
        <div
          key={template.id}
          className="relative group overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-pink-500 transition-all cursor-pointer"
        >
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            <span className="text-gray-600 text-sm">Template Preview</span>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white">{template.name}</h3>
            <p className="text-gray-400 mt-2 text-sm">Click to select this template</p>
          </div>
        </div>
      ))}
    </div>
  );
}
