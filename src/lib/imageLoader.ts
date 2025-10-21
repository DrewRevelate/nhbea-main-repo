// Custom image loader for static export optimization
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // For external URLs, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // For local images in static export, return the original src
  // In production, you might want to integrate with a CDN service like Cloudinary
  const params = new URLSearchParams();
  
  if (quality) {
    params.set('q', quality.toString());
  }
  
  if (width) {
    params.set('w', width.toString());
  }
  
  const paramsString = params.toString();
  return `${src}${paramsString ? `?${paramsString}` : ''}`;
}