import { useEffect } from 'react';
import type { SiteConfig } from '@/types';

interface AnalyticsScriptsProps {
  config: SiteConfig;
}

export function AnalyticsScripts({ config }: AnalyticsScriptsProps) {
  useEffect(() => {
    // Google Analytics
    if (config.analytics.googleAnalyticsId) {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics.googleAnalyticsId}`;
      document.head.appendChild(gtagScript);

      const gtagConfig = document.createElement('script');
      gtagConfig.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.analytics.googleAnalyticsId}');
      `;
      document.head.appendChild(gtagConfig);
    }

    // Microsoft Clarity
    if (config.analytics.microsoftClarityId) {
      const clarityScript = document.createElement('script');
      clarityScript.textContent = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${config.analytics.microsoftClarityId}");
      `;
      document.head.appendChild(clarityScript);
    }

    // Meta Pixel
    if (config.analytics.metaPixelId) {
      const pixelScript = document.createElement('script');
      pixelScript.textContent = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${config.analytics.metaPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(pixelScript);

      const pixelNoScript = document.createElement('noscript');
      pixelNoScript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${config.analytics.metaPixelId}&ev=PageView&noscript=1" />`;
      document.body.appendChild(pixelNoScript);
    }

    return () => {
      // Cleanup not needed for analytics scripts
    };
  }, [config.analytics]);

  return null;
}
