export default function PricingPage() {
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          Pricing
        </h1>
        <p className="text-xl text-gray-300 mb-12 text-center max-w-2xl mx-auto">
          Unlock premium features and remove watermarks from your viral videos
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800">
            <h2 className="text-3xl font-bold mb-4">Free</h2>
            <p className="text-4xl font-bold mb-6 text-pink-400">$0</p>
            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Generate unlimited videos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Access to all templates</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✗</span>
                <span className="line-through">Videos include watermark</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✗</span>
                <span className="line-through">HD quality (720p only)</span>
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-gray-800 text-white font-semibold">
              Current Plan
            </button>
          </div>

          {/* Premium Tier */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 border-2 border-pink-500">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 rounded-full bg-pink-500 text-white text-sm font-semibold">
                POPULAR
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Premium</h2>
            <p className="text-4xl font-bold mb-6 text-pink-400">
              $9<span className="text-lg text-gray-400">/video</span>
            </p>
            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 text-pink-400">✓</span>
                <span>No watermark</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-pink-400">✓</span>
                <span>Full HD quality (1080p)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-pink-400">✓</span>
                <span>Priority processing</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-pink-400">✓</span>
                <span>Commercial usage rights</span>
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold hover:brightness-110 transition">
              Upgrade Now
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-pink-400 hover:text-pink-300 underline text-lg">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
