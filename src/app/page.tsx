// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="/logo.jpg" 
              alt="Virtue College Logo" 
              className="h-24 w-auto bg-white rounded-full p-2 shadow-lg" 
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#6F4E37] mb-6">
            Welcome to <span className="text-[#4A332A]">Virtue College JSS Alumni</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Connecting generations of excellence. Meet the outstanding Junior Secondary graduates of the 2025/2026 set.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/directory"
              className="bg-[#6F4E37] text-[#FDFBF7] px-8 py-3 rounded-lg font-semibold hover:bg-[#5a3e2b] transition-colors shadow-lg"
            >
              View Alumni Directory
            </Link>
            <Link
              href="/login"
              className="bg-white text-[#6F4E37] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg border-2 border-[#6F4E37]"
            >
              JSS Graduate Login
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 border-t border-b border-[#6F4E37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#6F4E37] mb-2">JSS3 2025/2026</div>
              <div className="text-gray-600">Graduating Set</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#6F4E37] mb-2">100%</div>
              <div className="text-gray-600">Connected</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#6F4E37] mb-2">∞</div>
              <div className="text-gray-600">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-[#6F4E37]/10">
          <h2 className="text-3xl font-bold text-[#6F4E37] mb-6 text-center">
            About Our JSS Alumni Network
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            The Virtue College JSS Alumni Network is dedicated to fostering lifelong connections among our Junior Secondary graduates. 
            Our platform allows alumni to stay connected, share their achievements, and inspire the next generation.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Whether you're looking to reconnect with old classmates, find mentorship opportunities, or share your 
            professional journey, this is your space to shine.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#4A332A] text-[#FDFBF7] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-100/80">
            © 2026 Virtue College JSS Alumni Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}