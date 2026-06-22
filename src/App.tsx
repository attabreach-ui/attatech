import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import type { Testimonial } from '@/types';
import { useSiteConfig } from '@/hooks/use-site-config';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Navbar } from '@/components/layout/navbar';
import { Preloader } from '@/components/layout/preloader';
import { Footer } from '@/components/layout/footer';
import { BackToTop } from '@/components/layout/back-to-top';
import { CustomCursor } from '@/components/custom/custom-cursor';
import { HomePage } from '@/pages/home';
import { AdminPage } from '@/pages/admin';
import { PricingPage } from '@/pages/pricing';
import { BlogPage } from '@/pages/blog';
import { BlogPostPage } from '@/pages/blog-post';
import { ProjectPage } from '@/pages/project';
import { ScrollToTop } from '@/components/scroll-to-top';
import { SEOHead } from '@/components/seo-head';
import { AnalyticsScripts } from '@/components/analytics-scripts';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';
  const { user } = useAdminAuth();

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('dark-mode') === 'true' ||
        (!localStorage.getItem('dark-mode') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  const [preloaderDone, setPreloaderDone] = useState(false);

  const {
    config,
    loading: configLoading,
    saveSettings,
    saveStats,
    saveServices,
    saveProjects,
    saveFaqs,
    savePricing,
    saveBlogPosts,
    saveWhyChooseUs,
    saveClientLogos,
    saveAnalytics,
    saveNewsletter,
    saveIntake,
    refetch,
  } = useSiteConfig();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', String(darkMode));
  }, [darkMode]);

  // Update <title> and meta description from live config
  useEffect(() => {
    if (!configLoading && config.seo.title && !isAdminRoute) {
      document.title = config.seo.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', config.seo.description);
    }
    if (isAdminRoute) {
      document.title = 'Dashboard — AttaTech Admin';
    }
  }, [config.seo, configLoading, isAdminRoute]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // testimonials are managed via supabase reviews — refetch after admin approves
  const updateTestimonials = useCallback((_testimonials: Testimonial[]) => {
    refetch();
  }, [refetch]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <SEOHead config={config} pathname={location.pathname} />
      <AnalyticsScripts config={config} />
      <CustomCursor />
      {!preloaderDone && !isAdminRoute && <Preloader onComplete={() => setPreloaderDone(true)} />}

      <div className={`transition-opacity duration-500 ${preloaderDone || isAdminRoute ? 'opacity-100' : 'opacity-0'}`}>
        {!isAdminRoute && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}

        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HomePage config={config} onUpdateTestimonials={updateTestimonials} />
                <Footer config={config} />
                <BackToTop />
              </>
            }
          />
          <Route
            path="/pricing"
            element={
              <>
                <PricingPage config={config} />
                <Footer config={config} />
              </>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                <BlogPage config={config} />
                <Footer config={config} />
              </>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <>
                <BlogPostPage config={config} />
                <Footer config={config} />
              </>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <>
                <ProjectPage config={config} />
                <Footer config={config} />
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPage
                config={config}
                onSaveSettings={saveSettings}
                onSaveStats={saveStats}
                onSaveServices={saveServices}
                onSaveProjects={saveProjects}
                onSaveFaqs={saveFaqs}
                onSavePricing={savePricing}
                onSaveBlogPosts={saveBlogPosts}
                onSaveWhyChooseUs={saveWhyChooseUs}
                onSaveClientLogos={saveClientLogos}
                onSaveAnalytics={saveAnalytics}
                onSaveNewsletter={saveNewsletter}
                onSaveIntake={saveIntake}
                onRefetch={refetch}
                user={user}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
