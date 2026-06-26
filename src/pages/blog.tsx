import { Link } from 'react-router-dom';
import type { SiteConfig, BlogPost } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { Calendar, ArrowRight, Tag, User } from 'lucide-react';

interface BlogPageProps {
  config: SiteConfig;
}

export function BlogPage({ config }: BlogPageProps) {
  const publishedPosts = (config.blogPosts || []).filter((p) => p.published);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e27]">
      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
              Blog
            </span>
          </ScrollReveal>
          <TextReveal
            text="Insights & Updates"
            tag="h1"
            className="text-4xl md:text-5xl font-bold text-[#0a0e27] dark:text-white mb-4"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Thoughts on software development, business automation, and building technology for real operations.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {publishedPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#0a0e27] dark:text-white mb-2">
                Coming Soon
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We are working on insightful articles about software development, business automation, and technology. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedPosts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <ScrollReveal delay={index * 0.1}>
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
      >
        <div className="aspect-video bg-slate-100 dark:bg-white/5 overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="w-12 h-12 text-blue-500/30" />
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              {post.author}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#0a0e27] dark:text-white mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-blue-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Read <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}
