import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Payment Successful!
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
          <ul className="text-left space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="text-pink-400 mr-3">✓</span>
              <span>Your watermark-free video is being processed</span>
            </li>
            <li className="flex items-start">
              <span className="text-pink-400 mr-3">✓</span>
              <span>You'll receive an email with your download link</span>
            </li>
            <li className="flex items-start">
              <span className="text-pink-400 mr-3">✓</span>
              <span>Videos are available in full HD quality (1080p)</span>
            </li>
            <li className="flex items-start">
              <span className="text-pink-400 mr-3">✓</span>
              <span>You have commercial usage rights for this video</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 font-semibold hover:brightness-110 transition"
          >
            Create Another Video
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-xl bg-gray-800 font-semibold hover:bg-gray-700 transition"
          >
            View Pricing
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Need help? Contact us at support@viralfaces.ai
        </p>
      </div>
    </main>
  );
}
