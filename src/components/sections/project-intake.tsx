import { useState } from 'react';
import type { SiteConfig, IntakeField } from '@/types';
import { ScrollReveal } from '@/components/custom/scroll-reveal';
import { TextReveal } from '@/components/custom/text-reveal';
import { ArrowRight, Check, Loader2, ChevronRight, ChevronLeft, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectIntakeProps {
  config: SiteConfig;
}

export function ProjectIntake({ config }: ProjectIntakeProps) {
  if (!config.intake.enabled) return null;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const step = config.intake.steps[currentStep];
  const isLastStep = currentStep === config.intake.steps.length - 1;

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const validateStep = () => {
    if (!step) return true;
    return step.fields.every((field) => {
      if (!field.required) return true;
      return formData[field.id]?.trim() !== '';
    });
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((p) => p + 1);
    }
  };

  const handleSubmit = async () => {
    const endpoint = (config.formspreeEndpoint && !config.formspreeEndpoint.includes('YOUR_FORM_ID'))
      ? config.formspreeEndpoint
      : 'https://formspree.io/f/mqevkoao';
    setSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...formData,
          _subject: 'New Project Intake — AttaTech',
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success('Thank you! We will contact you within 24 hours.');
      } else {
        toast.error(`Submission failed (status ${res.status}). Please try WhatsApp.`);
      }
    } catch {
      toast.error('Failed to submit. Please contact us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 md:py-28 bg-white dark:bg-[#0a0e27]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-[#0a0e27] dark:text-white mb-4">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your project details have been submitted. We will review and get back to you within 24 hours via WhatsApp or email.
          </p>
          <a
            href={config.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25d366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0a0e27]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
              Get Started
            </span>
          </ScrollReveal>
          <TextReveal
            text={config.intake.title}
            tag="h2"
            className="text-3xl md:text-4xl font-bold text-[#0a0e27] dark:text-white mb-4"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground">{config.intake.description}</p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.3}>
          <div className="bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 md:p-8">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {config.intake.steps.map((s, i) => (
                <div key={s.id} className="flex-1">
                  <div className={`h-2 rounded-full transition-all ${i <= currentStep ? 'bg-blue-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                  <p className={`text-xs mt-2 text-center ${i <= currentStep ? 'text-blue-500 font-medium' : 'text-muted-foreground'}`}>
                    {s.title}
                  </p>
                </div>
              ))}
            </div>

            {step && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-[#0a0e27] dark:text-white mb-4">
                  {step.title}
                </h3>
                {step.fields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={formData[field.id] || ''}
                    onChange={(v) => handleFieldChange(field.id, v)}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-[#0a0e27] dark:hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-medium rounded-xl transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : isLastStep ? (
                  <>
                    Submit
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FieldRenderer({ field, value, onChange }: { field: IntakeField; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0a0e27] dark:text-white mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{field.placeholder}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#0a0e27] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}
