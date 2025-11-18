export default function TemplateGallery() {
  const templates = [
    { id: "trump-dance", title: "Trump Victory Dance", thumbnail: "/thumbs/trump.jpg" },
    { id: "elon-cybertruck", title: "Elon Cybertruck Flex", thumbnail: "/thumbs/elon.jpg" },
    { id: "taylor-eras", title: "Taylor Swift Eras Tour", thumbnail: "/thumbs/taylor.jpg" },
    { id: "mrbeast-money", title: "MrBeast Money Rain", thumbnail: "/thumbs/mrbeast.jpg" },
    { id: "rizz", title: "Ohio Rizz Face", thumbnail: "/thumbs/rizz.jpg" },
    // Add 100+ more
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {templates.map((t) => (
        <div key={t.id} className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-2xl aspect-video bg-gray-900">
            <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
              <p className="text-lg font-bold">{t.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
