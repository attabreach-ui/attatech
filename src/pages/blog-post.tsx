import { useParams, Link } from 'react-router-dom';
import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

interface BlogPostPageProps {
  config: SiteConfig;
}

export function BlogPostPage({ config }: BlogPostPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const post = config.blogPosts.find((p) => p.slug === slug && p.published);

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0a0e27] dark:text-white mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you are looking for does not exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e27]">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <ScrollReveal>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all posts
          </Link>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0e27] dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm rounded-full flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </ScrollReveal>

        {post.coverImage && (
          <ScrollReveal delay={0.3}>
            <div className="aspect-video rounded-2xl overflow-hidden mb-10 bg-slate-100 dark:bg-white/5">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.4}>
          <div className="prose dark:prose-invert prose-lg max-w-none">
            <div className="text-[#0a0e27]/80 dark:text-white/80 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </ScrollReveal>
      </article>
    </div>
  );
}
