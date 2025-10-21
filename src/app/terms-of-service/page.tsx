import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - NHBEA',
  description: 'Terms and conditions for using the New Hampshire Business Education Association website and services.',
  robots: 'index, follow',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="py-16 lg:py-24 bg-[var(--nhbea-royal-blue-dark)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--nhbea-royal-blue-dark)]">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/90 max-w-3xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using our services.
            </p>
            <div className="mt-8 text-white/70 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 space-y-8">
              
              {/* Introduction */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Service ("Terms") govern your use of the New Hampshire Business Education Association 
                  ("NHBEA," "we," "us," or "our") website located at nhbea-64cab.web.app (the "Service") operated by NHBEA.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part 
                  of these terms, then you may not access the Service.
                </p>
              </div>

              {/* Acceptance of Terms */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              {/* Use License */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials on NHBEA's website for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on NHBEA's website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated 
                  by NHBEA at any time. Upon terminating your viewing of these materials or upon the termination of this license, 
                  you must destroy any downloaded materials in your possession whether in electronic or printed format.
                </p>
              </div>

              {/* User Accounts */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                  You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You must be at least 18 years old to create an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>We reserve the right to terminate accounts that violate these terms</li>
                </ul>
              </div>

              {/* Membership and Services */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Membership and Services</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Membership Terms</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Membership fees are non-refundable unless otherwise specified</li>
                  <li>Memberships are valid for one calendar year from the date of purchase</li>
                  <li>Members must renew annually to maintain active status</li>
                  <li>We reserve the right to modify membership benefits and pricing with notice</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Conference and Event Registration</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Registration fees are generally non-refundable unless the event is cancelled by NHBEA</li>
                  <li>Substitutions may be allowed with advance notice</li>
                  <li>NHBEA reserves the right to cancel events due to insufficient enrollment or unforeseen circumstances</li>
                  <li>Participants are expected to conduct themselves professionally at all events</li>
                </ul>
              </div>

              {/* Prohibited Uses */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You may not use our Service:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>For any obscene or immoral purpose</li>
                  <li>To interfere with or circumvent the security features of the Service</li>
                </ul>
              </div>

              {/* Content and Intellectual Property */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Content and Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of 
                  NHBEA and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our trademarks and trade dress may not be used in connection with any product or service without our prior 
                  written consent.
                </p>
              </div>

              {/* Disclaimer */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed">
                  The materials on NHBEA's website are provided on an 'as is' basis. NHBEA makes no warranties, expressed or implied, 
                  and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions 
                  of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Further, NHBEA does not warrant or make any representations concerning the accuracy, likely results, or reliability 
                  of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                </p>
              </div>

              {/* Limitations */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall NHBEA or its suppliers be liable for any damages (including, without limitation, damages for 
                  loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials 
                  on NHBEA's website, even if NHBEA or an authorized representative has been notified orally or in writing of the 
                  possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations 
                  of liability for consequential or incidental damages, these limitations may not apply to you.
                </p>
              </div>

              {/* Termination */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, 
                  under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach 
                  of the Terms.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  If you wish to terminate your account, you may simply discontinue using the Service or contact us directly.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed and construed in accordance with the laws of New Hampshire, United States, 
                  without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms 
                  will not be considered a waiver of those rights.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms of Service</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
                  we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will 
                  be determined at our sole discretion.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>New Hampshire Business Education Association</strong></p>
                  <p>Email: Contact form available on our website</p>
                  <p>Website: nhbea-64cab.web.app</p>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  We will respond to your inquiry within a reasonable timeframe.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}