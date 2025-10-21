'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  link?: string;
}

const benefits: Benefit[] = [
  {
    id: '1',
    icon: '🎓',
    title: 'Professional Development',
    description: 'Access to workshops, seminars, and certification programs to advance your career in business education.',
    link: '/conference'
  },
  {
    id: '2', 
    icon: '🤝',
    title: 'Networking Opportunities',
    description: 'Connect with fellow educators, industry professionals, and thought leaders across New Hampshire.',
  },
  {
    id: '3',
    icon: '🏆',
    title: 'Recognition Programs',
    description: 'Nominate deserving colleagues for prestigious awards that celebrate excellence in business education.',
    link: '/awards'
  },
  {
    id: '4',
    icon: '📚',
    title: 'Educational Resources',
    description: 'Access exclusive teaching materials, curriculum guides, and best practices from experienced educators.',
  },
  {
    id: '5',
    icon: '💼',
    title: 'Career Advancement',
    description: 'Job postings, mentorship opportunities, and career guidance to help you grow professionally.',
  },
  {
    id: '6',
    icon: '📧',
    title: 'Regular Updates',
    description: 'Stay informed with newsletters, announcements, and industry insights delivered to your inbox.',
  }
];

export default function MembershipBenefitsHighlight() {
  const [hoveredBenefit, setHoveredBenefit] = useState<string | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--nhbea-royal-blue)] mb-4">
            Why Join NHBEA?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Become part of New Hampshire's premier community of business educators and unlock exclusive benefits that will enhance your career and impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {benefits.map((benefit) => {
            const BenefitCard = benefit.link ? Link : 'div';
            const cardProps = benefit.link 
              ? { href: benefit.link, className: "block" }
              : {};

            return (
              <BenefitCard key={benefit.id} {...cardProps}>
                <div 
                  className={`bg-gray-50 rounded-xl p-6 h-full transition-all duration-300 ${
                    benefit.link ? 'hover:shadow-lg hover:bg-white cursor-pointer' : ''
                  } ${
                    hoveredBenefit === benefit.id ? 'transform -translate-y-1' : ''
                  }`}
                  onMouseEnter={() => setHoveredBenefit(benefit.id)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-[var(--nhbea-royal-blue)] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                  {benefit.link && (
                    <div className="mt-4 text-[var(--nhbea-accent-gold)] font-medium text-sm">
                      Learn More →
                    </div>
                  )}
                </div>
              </BenefitCard>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-blue-700 rounded-2xl p-8 max-w-4xl mx-auto text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h3>
            <p className="text-blue-100 mb-6">
              Choose the membership type that's right for you and start making connections that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/membership/professional"
                className="px-8 py-3 bg-white text-[var(--nhbea-royal-blue)] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Professional Membership
              </Link>
              <Link 
                href="/membership/student"
                className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-[var(--nhbea-royal-blue)] transition-colors"
              >
                Student Membership
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}