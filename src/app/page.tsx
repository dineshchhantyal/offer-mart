import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-black py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl text-primary dark:text-white md:text-6xl font-bold mb-6">
              Save Money, Reduce Waste
            </h1>
            <p className="text-xl mb-8  text-green-500 dark:text-gray-200">
              Join our community marketplace for near-expiry goods and make a
              difference.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/sell"
                className="bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition"
              >
                Start Selling
              </Link>
              <Link
                href="/browse"
                className="border-2 border-green-700 text-green-700 dark:border-green-500 dark:text-green-500 px-8 py-3 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-50 dark:text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature cards with improved contrast */}
            <div className="text-center p-6">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-700 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-50 dark:text-white mb-2">
                List Your Products
              </h3>
              <p className="text-gray-100 dark:text-gray-300">
                Choose between commission-free or commission-based listings
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-700 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-50 dark:text-white mb-2">
                AI Quality Check
              </h3>
              <p className="text-gray-100 dark:text-gray-300">
                Our AI assesses product quality and remaining shelf life
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-700 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-50 dark:text-white mb-2">
                Save Money
              </h3>
              <p className="text-gray-100 dark:text-gray-300">
                Get great deals on quality products near expiry
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-green-50 dark:bg-green-950 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary dark:text-white mb-12">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-green-700 dark:text-green-400 mb-2">
                1000+
              </div>
              <div className="text-primary dark:text-gray-300">
                Products Saved
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-700 dark:text-green-400 mb-2">
                500+
              </div>
              <div className="text-primary dark:text-gray-300">
                Active Users
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-700 dark:text-green-400 mb-2">
                2 tons
              </div>
              <div className="text-primary dark:text-gray-300">
                Waste Reduced
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
