import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 font-semibold hover:brightness-110 transition"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
