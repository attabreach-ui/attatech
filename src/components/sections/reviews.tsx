import { useState, useEffect } from 'react';
import type { SiteConfig, Testimonial } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { getInitials } from '@/lib/utils';
import { Star, ChevronLeft, ChevronRight, Quote, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ReviewsProps {
  config: SiteConfig;
  onUpdateTestimonials: (t: Testimonial[]) => void;
}

export function Reviews({ config, onUpdateTestimonials }: ReviewsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({ name: '', role: '', company: '', rating: 5, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch approved reviews from Supabase on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Map Supabase rows to Testimonial type
        const testimonials: Testimonial[] = data.map((row) => ({
          id: row.id,
          name: row.name,
          role: row.role || '',
          company: row.company || '',
          rating: row.stars,
          text: row.review_text,
          approved: true,
          date: row.created_at,
        }));
        onUpdateTestimonials(testimonials);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      // Fallback to local config testimonials if Supabase fails
    } finally {
      setIsLoading(false);
    }
  };

  const approved = config.testimonials.filter((t) => t.approved);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % Math.max(approved.length, 1));
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + Math.max(approved.length, 1)) % Math.max(approved.length, 1));

  useEffect(() => {
    if (approved.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [approved.length]);

  // Reset slide if it goes out of bounds after reviews load
  useEffect(() => {
    if (currentSlide >= approved.length && approved.length > 0) {
      setCurrentSlide(0);
    }
  }, [approved.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          name: formData.name.trim(),
          role: formData.role.trim() || null,
          company: formData.company.trim() || null,
          stars: formData.rating,
          review_text: formData.text.trim(),
          approved: false,
        },
      ]);

      if (error) throw error;

      setFormData({ name: '', role: '', company: '', rating: 5, text: '' });
      toast.success('Thank you! Your review has been submitted for approval. ✅');
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Could not submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate?.(star)}
            className={cn(
              interactive && 'hover:scale-110 transition-transform',
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
            )}
            disabled={!interactive}
          >
            <Star className="w-5 h-5" fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <section id="reviews" className="py-20 md:py-28 bg-slate-50 dark:bg-[#080c20] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
              Testimonials
            </span>
          </ScrollReveal>
          <TextReveal
            text="Client Reviews"
            tag="h2"
            className="text-3xl md:text-4xl font-bold text-[#0a0e27] dark:text-white"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Testimonial Carousel */}
          <ScrollReveal>
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-8 h-full">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                  <p className="text-muted-foreground text-sm">Loading reviews...</p>
                </div>
              ) : approved.length > 0 ? (
                <>
                  <Quote className="w-10 h-10 text-blue-500/30 mb-4" />
                  <div className="relative min-h-[200px]">
                    {approved.map((t, i) => (
                      <div
                        key={t.id}
                        className={cn(
                          'transition-all duration-500',
                          i === currentSlide ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
                        )}
                      >
                        <div className="mb-4">{renderStars(t.rating)}</div>
                        <p className="text-lg text-[#0a0e27] dark:text-white/90 italic leading-relaxed mb-6">
                          &ldquo;{t.text}&rdquo;
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                            {getInitials(t.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0a0e27] dark:text-white">{t.name}</p>
                            <p className="text-sm text-muted-foreground">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {approved.length > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-black/5 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        {approved.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={cn(
                              'w-2 h-2 rounded-full transition-all',
                              i === currentSlide ? 'w-6 bg-blue-500' : 'bg-blue-500/30'
                            )}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={prevSlide} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextSlide} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
                  <Quote className="w-12 h-12 text-blue-500/30 mb-4" />
                  <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Review Form */}
          <ScrollReveal delay={0.2}>
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-[#0a0e27] dark:text-white mb-6">
                Write a Review
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Role / Company</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. CEO at ABC"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Rating</label>
                  {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">Your Review *</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    placeholder="Share your experience..."
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
