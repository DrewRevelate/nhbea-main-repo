'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function ConferenceHomeBanner() {
  return (
    <div className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-blue-700 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Us at the NHBEA Annual Conference
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Connect with educators, explore innovative teaching methods, and advance business education
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm text-blue-200">Date</div>
                <div className="font-semibold">TBA</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <MapPin className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm text-blue-200">Location</div>
                <div className="font-semibold">TBA</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <Users className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm text-blue-200">Expected</div>
                <div className="font-semibold">200+ Educators</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/conference"
              className="px-8 py-3 bg-white text-[var(--nhbea-royal-blue)] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Learn More
            </Link>
            <Link
              href="/conference/register"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
