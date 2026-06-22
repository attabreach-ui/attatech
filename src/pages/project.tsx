import { useParams, Link } from 'react-router-dom';
import type { SiteConfig } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import {
  ArrowLeft, ExternalLink, Building2, MapPin, Calendar, CheckCircle2,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useState } from 'react';

interface ProjectPageProps {
  config: SiteConfig;
}

export function ProjectPage({ config }: ProjectPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const project = config.projects.find((p) =>
    p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === slug
  );
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0a0e27] dark:text-white mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you are looking for does not exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e27]">
      <article className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <ScrollReveal>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to portfolio
          </Link>
        </ScrollReveal>

        {/* Hero */}
        <ScrollReveal>
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 bg-slate-100 dark:bg-white/5">
            <img
              src={project.screenshots[0]?.src}
              alt={project.screenshots[0]?.alt || project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full mb-3 inline-block">
                {project.type}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {project.client}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {project.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {project.year}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-[#0a0e27] dark:text-white mb-4">About This Project</h2>
              <p className="text-[#0a0e27]/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                {project.longDescription}
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="text-2xl font-bold text-[#0a0e27] dark:text-white mb-4">Key Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-[#0a0e27]/70 dark:text-white/70 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="text-2xl font-bold text-[#0a0e27] dark:text-white mb-4">Results & Impact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.results.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4">
                    <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm shrink-0">
                      &#10003;
                    </span>
                    <span className="text-green-800 dark:text-green-300 text-sm">{r}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {project.screenshots.length > 0 && (
              <ScrollReveal>
                <h2 className="text-2xl font-bold text-[#0a0e27] dark:text-white mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 gap-4">
                  {project.screenshots.map((shot, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-black/5 dark:border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxImage(i)}
                    >
                      <img src={shot.src} alt={shot.alt} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

          <div className="space-y-8">
            <ScrollReveal>
              <div className="bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-[#0a0e27] dark:text-white mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-[#0a0e27] dark:text-white mb-4">Project Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client</span>
                    <span className="text-[#0a0e27] dark:text-white font-medium">{project.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="text-[#0a0e27] dark:text-white font-medium">{project.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="text-[#0a0e27] dark:text-white font-medium">{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year</span>
                    <span className="text-[#0a0e27] dark:text-white font-medium">{project.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-[#0a0e27] dark:text-white font-medium">{project.type}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Live Demo
              </a>
            </ScrollReveal>
          </div>
        </div>
      </article>

      {/* Lightbox */}
      {lightboxImage !== null && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors" onClick={() => setLightboxImage(null)}>
            <X className="w-5 h-5" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors" onClick={(e) => { e.stopPropagation(); setLightboxImage((lightboxImage - 1 + project.screenshots.length) % project.screenshots.length); }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors" onClick={(e) => { e.stopPropagation(); setLightboxImage((lightboxImage + 1) % project.screenshots.length); }}>
            <ChevronRight className="w-5 h-5" />
          </button>
          <img src={project.screenshots[lightboxImage]?.src} alt={project.screenshots[lightboxImage]?.alt} className="max-w-full max-h-[85vh] rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
