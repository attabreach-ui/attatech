import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Testimonial } from '@/types';
import { useSiteConfig } from '@/hooks/use-site-config';
import { Navbar } from '@/components/layout/navbar';
import { Preloader } from '@/components/layout/preloader';
import { Footer } from '@/components/layout/footer';
import { BackToTop } from '@/components/layout/back-to-top';
import { CustomCursor } from '@/components/custom/custom-cursor';
import { HomePage } from '@/pages/home';
import { AdminPage } from '@/pages/admin';

function App() {
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
    if (!configLoading && config.seo.title) {
      document.title = config.seo.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', config.seo.description);
    }
  }, [config.seo, configLoading]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // testimonials are managed via supabase reviews — refetch after admin approves
  const updateTestimonials = useCallback((_testimonials: Testimonial[]) => {
    refetch();
  }, [refetch]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <CustomCursor />
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      <div className={`transition-opacity duration-500 ${preloaderDone ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

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
            path="/admin"
            element={
              <AdminPage
                config={config}
                onSaveSettings={saveSettings}
                onSaveStats={saveStats}
                onSaveServices={saveServices}
                onSaveProjects={saveProjects}
                onSaveFaqs={saveFaqs}
                onRefetch={refetch}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
