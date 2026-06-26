import { useState } from 'react';
import type { SiteConfig, Project } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { X, ExternalLink, ChevronLeft, ChevronRight, MapPin, Calendar, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectsProps {
  config: SiteConfig;
}

const filterTabs = ['All', 'WMS', 'Inventory', 'HR', 'Web Apps', 'Other'];

export function Projects({ config }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const filtered = activeFilter === 'All'
    ? (config.projects || []).filter(Boolean)
    : (config.projects || []).filter(Boolean).filter((p) => p.type === activeFilter);

  const openLightbox = (index: number) => setLightboxImage(index);
  const closeLightbox = () => setLightboxImage(null);
  const nextImage = () => {
    if (selectedProject && lightboxImage !== null) {
      setLightboxImage((lightboxImage + 1) % selectedProject.screenshots.length);
    }
  };
  const prevImage = () => {
    if (selectedProject && lightboxImage !== null) {
      setLightboxImage((lightboxImage - 1 + selectedProject.screenshots.length) % selectedProject.screenshots.length);
    }
  };

  return (
    <section id="projects" className="py-20 md:py-28 bg-white dark:bg-[#0a0e27] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
              Portfolio
            </span>
          </ScrollReveal>
          <TextReveal
            text="Featured Projects"
            tag="h2"
            className="text-3xl md:text-4xl font-bold text-[#0a0e27] dark:text-white"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Real systems, real clients, real results
            </p>
          </ScrollReveal>
        </div>

        {/* Filter Tabs */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeFilter === tab
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-100 dark:bg-white/10 text-muted-foreground hover:text-[#0a0e27] dark:hover:text-white'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.15}>
              <div
                className="group cursor-pointer bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 glow-blue-hover"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={project.screenshots[0]?.src}
                    alt={project.screenshots[0]?.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium flex items-center gap-2">
                      View Case Study <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      {project.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#0a0e27] dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0f1535] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedProject.screenshots[0]?.src}
                alt={selectedProject.screenshots[0]?.alt}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => { setSelectedProject(null); setLightboxImage(null); }}
                className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full mb-3 inline-block">
                  {selectedProject.type}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedProject.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {selectedProject.client}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedProject.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedProject.year}</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">{selectedProject.longDescription}</p>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-4">Results & Impact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProject.results.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-3">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs shrink-0">&#10003;</span>
                      <span className="text-sm text-green-800 dark:text-green-300">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-mono rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {selectedProject.screenshots.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-4">Screenshots</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProject.screenshots.map((shot, i) => (
                      <div
                        key={i}
                        className="rounded-xl overflow-hidden border border-black/5 dark:border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openLightbox(i)}
                      >
                        <img src={shot.src} alt={shot.alt} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Live Demo
                </a>
                <a
                  href="https://wa.me/923478481093"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-medium rounded-xl transition-colors"
                >
                  Discuss Your Project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage !== null && selectedProject && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-5 h-5" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <img
            src={selectedProject.screenshots[lightboxImage]?.src}
            alt={selectedProject.screenshots[lightboxImage]?.alt}
            className="max-w-full max-h-[85vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
