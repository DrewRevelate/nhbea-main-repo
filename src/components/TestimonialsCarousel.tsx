'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  institution: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "NHBEA has been instrumental in my professional development. The networking opportunities and resources have helped me become a better educator.",
    author: "Sarah Johnson",
    title: "Business Education Teacher",
    institution: "Manchester High School"
  },
  {
    id: '2', 
    quote: "The annual conference provides cutting-edge insights that I immediately apply in my classroom. It's invaluable for staying current with industry trends.",
    author: "Michael Chen",
    title: "Marketing Instructor", 
    institution: "Nashua Community College"
  },
  {
    id: '3',
    quote: "Being part of NHBEA means being part of a community that truly cares about student success and educational excellence.",
    author: "Jennifer Martinez",
    title: "Business Department Chair",
    institution: "Concord High School"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--nhbea-royal-blue)] mb-4">
            What Our Members Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from educators who are making a difference in business education across New Hampshire
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-2xl shadow-lg p-8 mx-auto max-w-3xl">
                    <div className="text-center">
                      <div className="text-4xl text-[var(--nhbea-accent-gold)] mb-4">"</div>
                      <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 italic">
                        {testimonial.quote}
                      </blockquote>
                      <div className="border-t pt-6">
                        <div className="font-semibold text-[var(--nhbea-royal-blue)] text-lg">
                          {testimonial.author}
                        </div>
                        <div className="text-gray-600">
                          {testimonial.title}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {testimonial.institution}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex 
                    ? 'bg-[var(--nhbea-royal-blue)]' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}