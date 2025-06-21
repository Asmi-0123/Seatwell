import { Link } from "wouter";
import { Twitter, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mb-4">
            <Link href="/">
              <button className="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors">
                Seatwell
              </button>
            </Link>
          </div>
          <p className="text-gray-600 text-sm">
            Making every empty seat an opportunity. Connecting sports fans across Switzerland.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              © 2024 Seatwell. All rights reserved. | Made in Switzerland 🇨🇭
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
