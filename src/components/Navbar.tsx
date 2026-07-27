// src/components/Navbar.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-[#6F4E37] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.jpg" 
                alt="Virtue College Logo" 
                className="h-12 w-auto mr-3 bg-white rounded-full p-1" 
              />
              <span className="text-[#FDFBF7] font-bold text-xl md:text-2xl">
                Virtue College JSS Alumni
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {session.user.role === "SUPER_ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-[#FDFBF7] hover:text-amber-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <span className="text-[#FDFBF7] text-sm hidden md:block">
                  {session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-[#FDFBF7] text-[#6F4E37] hover:bg-amber-100 px-4 py-2 rounded-md text-sm font-bold transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[#FDFBF7] text-[#6F4E37] hover:bg-amber-100 px-4 py-2 rounded-md text-sm font-bold transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}