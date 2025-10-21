import Image from 'next/image';

interface ContentSectionProps {
  title: string;
  content: string;
  imageURL?: string;
  reverse?: boolean;
}

export default function ContentSection({ title, content, imageURL, reverse = false }: ContentSectionProps) {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Content */}
          <div className={`space-y-8 ${reverse ? 'lg:col-start-2' : ''}`}>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
{title || "Content Title"}
                </span>
              </h2>
              
              <div className="space-y-6 text-lg md:text-xl text-slate-600 leading-relaxed">
                {(content || '').split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="font-light">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Optional CTA or additional content could go here */}
            <div className="pt-6">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </div>
          </div>
          
          {/* Image */}
          {imageURL && imageURL.trim() !== '' && (
            <div className={`relative ${reverse ? 'lg:col-start-1' : ''}`}>
              <div className="relative group">
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                {/* Main image container */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/20 backdrop-blur-sm">
                  <Image
                    src={imageURL}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}