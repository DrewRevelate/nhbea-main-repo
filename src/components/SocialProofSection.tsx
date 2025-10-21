'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  organization: string;
  content: string;
  image?: string;
}

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface SocialProofSectionProps {
  variant?: 'full' | 'compact';
  showTestimonials?: boolean;
  showStats?: boolean;
  className?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Business Teacher',
    organization: 'Concord High School',
    content: 'NHBEA has been instrumental in my professional development. The resources and networking opportunities have transformed how I teach business education.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Department Chair',
    organization: 'Manchester Community College',
    content: 'The annual conference is worth the membership alone. I always leave with fresh ideas and renewed enthusiasm for business education.',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Career & Technical Education Director',
    organization: 'Nashua School District',
    content: 'Being part of NHBEA connects me with passionate educators across the state. The collaboration and support are unmatched.',
  },
];

const stats: Stat[] = [
  { value: '250', label: 'Active Members', suffix: '+' },
  { value: '102', label: 'Years of Excellence' },
  { value: '92', label: 'Member Satisfaction', suffix: '%' },
  { value: '1000', label: 'Students Impacted Annually', suffix: '+' },
];

export default function SocialProofSection({ 
  variant = 'full', 
  showTestimonials = true, 
  showStats = true,
  className = '' 
}: SocialProofSectionProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Rotate testimonials
  useEffect(() => {
    if (!showTestimonials) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [showTestimonials]);


  if (variant === 'compact') {
    return null;
  }

  return (
    <section className={`py-16 lg:py-24 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Educators Across New Hampshire
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join hundreds of business educators who are advancing their careers and improving student outcomes with NHBEA
          </p>
        </div>


        {/* Testimonials */}
        {showTestimonials && (
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[var(--nhbea-royal-blue)] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial content */}
              <div className="relative">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`transition-all duration-500 ${
                      index === currentTestimonial 
                        ? 'opacity-100 visible' 
                        : 'opacity-0 invisible absolute inset-0'
                    }`}
                  >
                    <blockquote className="text-lg lg:text-xl text-gray-700 mb-6">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[var(--nhbea-royal-blue)]/10 flex items-center justify-center mr-4">
                          <span className="text-[var(--nhbea-royal-blue)] font-semibold">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div>
                        <cite className="font-semibold text-gray-900 not-italic">
                          {testimonial.name}
                        </cite>
                        <p className="text-sm text-gray-600">
                          {testimonial.title}, {testimonial.organization}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-[var(--nhbea-royal-blue)] w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Non-profit Organization
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Established 1978
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                NBEA Affiliated
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-6">
            Ready to join a community that's shaping the future of business education?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/membership/professional"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)] transition-colors"
            >
              Become a Member
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-[var(--nhbea-royal-blue)] bg-white border-2 border-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-subtle)] transition-colors"
            >
              Learn More About NHBEA
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}