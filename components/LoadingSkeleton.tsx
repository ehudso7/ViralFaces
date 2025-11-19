export function TemplateGallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-2xl aspect-video bg-gray-800" />
      ))}
    </div>
  );
}

export function UploadFormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-pulse">
      <div className="h-16 bg-gray-800 rounded-full" />
      <div className="h-16 bg-gray-800 rounded-xl" />
      <div className="h-20 bg-gray-800 rounded-2xl" />
    </div>
  );
}

export function VideoPlayerSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-video bg-gray-800 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 bg-gray-800 rounded-xl" />
        <div className="h-16 bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
}
