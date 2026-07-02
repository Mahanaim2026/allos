'use client';
import React, { useState } from 'react';
import Link from 'next/link';



const FEATURES = [
    'Daily devotional reminders / notifications',
    'Save and share passages with others',
    'Audio / voice reading of passages',
    'Community / group devotionals',
    'Longer / deeper content (book-length devotionals)',
    'Journalling / notes on passages',
    'Specific Bible translation preference',
    'More customisation of tone / style',
  ];

const RATING_LABELS: Record<number, string> = {
    1: 'Very dissatisfied',
    2: 'Dissatisfied',
    3: 'Neutral',
    4: 'Satisfied',
    5: 'Very satisfied',
};

type FormData = {
    overallRating: number;
    mostValuable: string;
    improvements: string;
    useFrequency: string;
    features: string[];
    recommend: string;
    otherFeedback: string;
    email: string;
};

const INITIAL: FormData = {
    overallRating: 0,
    mostValuable: '',
    improvements: '',
    useFrequency: '',
    features: [],
    recommend: '',
    otherFeedback: '',
    email: '',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1.5px solid #C8D8E8',
    fontFamily: 'Hanken Grotesk, sans-serif',
    fontSize: '0.95rem',
    color: '#0F2B45',
    background: '#FFFFFF',
    boxSizing: 'border-box',
    outline: 'none',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#0F2B45',
    marginBottom: 8,
};

const sectionStyle: React.CSSProperties = {
    marginBottom: 28,
};

export default function FeedbackPage() {
    const [form, setForm] = useState<FormData>(INITIAL);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

  const set = (field: keyof FormData, value: FormData[keyof FormData]) =>
                   setForm(prev => ({ ...prev, [field]: value }));

  const toggleFeature = (feat: string) => {
        setForm(prev => ({
                ...prev,
                features: prev.features.includes(feat)
                  ? prev.features.filter(f => f !== feat)
                          : [...prev.features, feat],
        }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.overallRating) { setError('Please select an overall rating.'); return; }
        setSubmitting(true);
        setError('');
        try {
                const res = await fetch('/api/feedback', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error('Server error');
                setSubmitted(true);
        } catch {
                setError('Something went wrong. Please try again.');
        } finally {
                setSubmitting(false);
        }
  };

  if (submitted) {
        return React.createElement('main', {
                style: { minHeight: '100vh', background: '#F7F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }
        },
                                         React.createElement('div', { style: { maxWidth: 520, textAlign: 'center' } },
                                                                     React.createElement('div', { style: { fontSize: '3rem', marginBottom: 16 } }, '\u2728'),
                                                                     React.createElement('h2', { style: { fontFamily: "'Spectral', Georgia, serif", fontSize: '1.6rem', color: '#0F2B45', marginBottom: 12 } }, 'Thank you for your feedback!'),
                                                                     React.createElement('p', { style: { fontFamily: 'Hanken Grotesk, sans-serif', color: '#4A7299', lineHeight: 1.6, marginBottom: 24 } },
                                                                                                   'Your response has been received and a summary has been sent to the Allos team. Your voice shapes what we build next.'
                                                                                                 ),
                                                                     React.createElement(Link, { href: '/app', style: { display: 'inline-block', background: '#0F2B45', color: '#FFFFFF', padding: '12px 28px', borderRadius: 100, fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' } }, '\u2190 Back to Allos')
                                                                   )
                                       );
  }

  return React.createElement('main', {
        style: { minHeight: '100vh', background: '#F7F3EE', padding: '48px 24px' }
  },
                                 React.createElement('div', { style: { maxWidth: 640, margin: '0 auto' } },
                                                           React.createElement('div', { style: { marginBottom: 32 } },
                                                                                       React.createElement(Link, { href: '/app', style: { fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#4A7299', textDecoration: 'none' } }, '\u2190 Back to Allos'),
                                                                                       React.createElement('h1', { style: { fontFamily: "'Spectral', Georgia, serif", fontSize: '2rem', color: '#0F2B45', margin: '16px 0 8px' } }, 'Allos Beta Feedback'),
                                                                                       React.createElement('p', { style: { fontFamily: 'Hanken Grotesk, sans-serif', color: '#4A7299', lineHeight: 1.6, margin: 0 } },
                                                                                                                     'Share your experience with Allos. Every response is read and helps shape what we build next.'
                                                                                                                   )
                                                                                     ),
                                                           React.createElement('form', { onSubmit: handleSubmit },
                                                                                       React.createElement('div', { style: { background: '#FFFFFF', borderRadius: 16, padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 20 } },
                                                                                                           
                                                                                                                     /* Q1 Overall Rating */
                                                                                                                     React.createElement('div', { style: sectionStyle },
                                                                                                                                                     React.createElement('label', { style: labelStyle }, '1. How satisfied are you with Allos overall?'),
                                                                                                                                                     React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' as const } },
                                                                                                                                                                                       [1, 2, 3, 4, 5].map(n =>
                                                                                                                                                                                                         React.createElement('button', {
                                                                                                                                                                                                                             key: n,
                                                                                                                                                                                                                             type: 'button',
                                                                                                                                                                                                                             onClick: () => set('overallRating', n),
                                                                                                                                                                                                                             title: RATING_LABELS[n],
                                                                                                                                                                                                                             style: {
                                                                                                                                                                                                                                                   width: 48, height: 48, borderRadius: 8,
                                                                                                                                                                                                                                                   border: form.overallRating === n ? '2px solid #0F2B45' : '1.5px solid #C8D8E8',
                                                                                                                                                                                                                                                   background: form.overallRating === n ? '#0F2B45' : '#F7F3EE',
                                                                                                                                                                                                                                                   color: form.overallRating === n ? '#FFFFFF' : '#0F2B45',
                                                                                                                                                                                                                                                   fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600,
                                                                                                                                                                                                                                                   fontSize: '1.1rem', cursor: 'pointer',
                                                                                                                                                                                                                                                 }
                                                                                                                                                                                                                           }, String(n))
                                                                                                                                                                                                                         )
                                                                                                                                                                                     ),
                                                                                                                                                     form.overallRating > 0 && React.createElement('p', {
                                                                                                                                                                     style: { fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#4A7299', margin: '6px 0 0' }
                                                                                                                                                       }, RATING_LABELS[form.overallRating])
                                                                                                                                                   ),
                                                                                                           
                                                                                                                     /* Q2 Most Valuable */
                                                                                                                     React.createElement('div', { style: sectionStyle },
                                                                                                                                                     React.createElement('label', { htmlFor: 'mostValuable', style: labelStyle }, '2. What do you find most valuable about Allos?'),
                                                                                                                                                     React.createElement('textarea', {
                                                                                                                                                                     id: 'mostValuable',
                                                                                                                                                                     rows: 3,
                                                                                                                                                                     value: form.mostValuable,
                                                                                                                                                                     onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => set('mostValuable', e.target.value),
                                                                                                                                                                     placeholder: 'e.g. The personalised scripture passages, the calm tone...',
                                                                                                                                                                     style: { ...inputStyle, resize: 'vertical' as const },
                                                                                                                                                       })
                                                                                                                                                   ),
                                                                                                           
                                                                                                                     /* Q3 Improvements */
                                                                                                                     React.createElement('div', { style: sectionStyle },
                                                                                                                                                     React.createElement('label', { htmlFor: 'improvements', style: labelStyle }, '3. What could be improved or added?'),
                                                                                                                                                     React.createElement('textarea', {
                                                                                                                                                                     id: 'improvements',
                                                                                                                                                                     rows: 3,
                                                                                                                                                                     value: form.improvements,
                                                                                                                                                                     onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => set('improvements', e.target.value),
                                                                                                                                                                     placeholder: 'e.g. Faster loading, more translation options...',
                                                                                                                                                                     style: { ...inputStyle, resize: 'vertical' as const },
                                                                                                                                                       })
                                                                                                                                                   ),
                                                                                                           
                                                                                                                     /* Q4 Use Frequency */
                                                                                                                     React.createElement('div', { style: sectionStyle },
                                                                                                                                                     React.createElement('label', { style: labelStyle }, '4. How often do you use Allos?'),
                                                                                                                                                     React.createElement('div', { style: { display: 'flex', flexDirection: 'column' as const, gap: 10 } },
                                                                                                                                                                                       ['Daily', 'A few times a week', 'Once a week', 'A few times a month', 'Rarely'].map(opt =>
                                                                                                                                                                                                         React.createElement('label', {
                                                                                                                                                                                                                             key: opt,
                                                                                                                                                                                                                             style: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.92rem', color: '#0F2B45' }
                                                                                                                                                                                                                           },
                                                                                                                                                                                                                                               React.createElement('input', {
                                                                                                                                                                                                                                                                     type: 'radio',
                                                                                                                                                                                                                                                                     name: 'useFrequency',
                                                                                                                                                                                                                                                                     value: opt,
                                                                                                                                                                                                                                                                     checked: form.useFrequency === opt,
                                                                                                                                                                                                                                                                     onChange: () => set('useFrequency', opt),
                                                                                                                                                                                                                                                                     style: { width: 18, height: 18, accentColor: '#0F2B45', cursor: 'pointer' }
                                                                                                                                                                                                                                                                   }),
                                                                                                                                                                                                                                               opt
                                                                                                                                                                                                                                             )
                                                                                                                                                                                                                                                                                         )
                                                                                                                                                                                     )
                                                                                                                                                   ),
                                                                                                           
                                                                                                                     /* Q5 Features — multi-select checkboxes (FIXED) */
                                                                                                                     React.createElement('div', { style: sectionStyle },
                                                                                                                                                     React.createElement('label', { style: labelStyle }, '5. What features are most important to you for future development? (select all that apply)'),
                                                                                                                                                     React.createElement('div', { style: { display: 'flex', flexDirection: 'column' as const, gap: 10 } },
                                                                                                                                                                                       FEATURES.map(feat =>
                                                                                                                                                                                                         React.createElement('label', {
                                                                                                                                                                                                                             key: feat,
                                                                                                                                                                                                                             style: {
                                                                                                                                                                                                                                                   display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
                                                                                                                                                                                                                                                   fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.92rem', color: '#0F2B45',
                                                                                                                                                                                                                                                   padding: '8px 12px', borderRadius: 8,
                                                                                                                                                                                                                                                   background: form.features.includes(feat) ? '#EEF4FA' : 'transparent',
                                                                                                                                                                                                                                                   border: form.features.includes(feat) ? '1.5px solid #B8D0E8' : '1.5px solid transparent',
                                                                                                                                                                                                                                                   transition: 'all 0.15s',
                                                                                                                                                                                                                                                 }
                                                                                                                                                                                                                           },
                                                                                                                                                                                                                                               React.createElement('input', {
                                                                                                                                                                                                                                                                     type: 'checkbox',
                                                                                                                                                                                                                                                                     checked: form.features.includes(feat),
                                                                                                                                                                                                                                                                     onChange: () => toggleFeature(feat),
                                                                                                                                                                                                                                                                     style: { width: 18, height: 18, accentColor: '#0F2B45', cursor: 'pointer', flexShrink: 0, marginTop: 1 }
                                                                                                                                                                                                                                                                   }),
                                                                                                                                                                                                                                               feat
                                                                                                                                                                                                                                             )
                                                                                                                                                                                                                  )
                                                                                                                                                                                     )
                                                                                                                                                   ),
                                                                                                           
                                                                                                                     /* Q6 Recommend */
                                                                                                                     React.createElement('div', { style: sectionStyle },
                                                                                                                                                     React.createElement('label', { style: labelStyle }, '6. How likely are you to recommend Allos to a friend?'),
                                                                                                                                                     React.createElement('div', { style: { display: 'flex', flexDirection: 'column' as const, gap: 10 } },
                                                                                                                                                                                       ['Very likely', 'Likely', 'Neutral', 'Unlikely', 'Very unlikely'].map(opt =>
                                                                                                                                                                                                         React.createElement('label', {
                                                                                                                                                                                                                             key: opt,
                                                                                                                                                                                                                             style: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.92rem', color: '#0F2B45' }
                                                                                                                                                                                                                           },
                                                                                                                                                                                                                                               React.createElement('input', {
                                                                                                                                                                                                                                                                     type: 'radio',
                                                                                                                                                                                                                                                                     name: 'recommend',
                                                                                                                                                                                                                                                                     value: opt,
                                                                                                                                                                                                                                                                     checked: form.recommend === opt,
                                                                                                                                                                                                                                                                     onChange: () => set('recommend', opt),
                                                                                                                                                                                                                                                                     style: { width: 18, height: 18, accentColor: '#0F2B45', cursor: 'pointer' }
                                                                                                                                                                                                                                                                   }),
                                                                                                                                                                                                                                               opt
                                                                                                                                                                                                                                             )
                                                                                                                                                                                                                                                                           )
                                                                                                                                                                                     )
                                                                                                                                                   ),
                                                                                                           
                                                                                                                     /* Q7 Other Feedback */
                                                                                                                     React.createElement('div', { style: sectionStyle },
                                                                                                                                                     React.createElement('label', { htmlFor: 'otherFeedback', style: labelStyle }, '7. Any other thoughts or prayer requests for the Allos team?'),
                                                                                                                                                     React.createElement('textarea', {
                                                                                                                                                                     id: 'otherFeedback',
                                                                                                                                                                     rows: 4,
                                                                                                                                                                     value: form.otherFeedback,
                                                                                                                                                                     onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => set('otherFeedback', e.target.value),
                                                                                                                                                                     placeholder: 'Anything else on your heart...',
                                                                                                                                                                     style: { ...inputStyle, resize: 'vertical' as const },
                                                                                                                                                       })
                                                                                                                                                   ),
                                                                                                           
                                                                                                                     /* Email (optional) */
                                                                                                                     React.createElement('div', { style: { ...sectionStyle, marginBottom: 0 } },
                                                                                                                                                     React.createElement('label', { htmlFor: 'email', style: labelStyle }, '8. Your email address (optional — for follow-up only)'),
                                                                                                                                                     React.createElement('input', {
                                                                                                                                                                     type: 'email',
                                                                                                                                                                     id: 'email',
                                                                                                                                                                     value: form.email,
                                                                                                                                                                     onChange: (e: React.ChangeEvent<HTMLInputElement>) => set('email', e.target.value),
                                                                                                                                                                     placeholder: 'you@example.com',
                                                                                                                                                                     style: inputStyle,
                                                                                                                                                       })
                                                                                                                                                   )
                                                                                                                   ),

                                                                                       error && React.createElement('p', {
                                                                                                   style: { fontFamily: 'Hanken Grotesk, sans-serif', color: '#C0392B', fontSize: '0.9rem', marginBottom: 12 }
                                                                                       }, error),

                                                                                       React.createElement('button', {
                                                                                                   type: 'submit',
                                                                                                   disabled: submitting,
                                                                                                   style: {
                                                                                                                 width: '100%', padding: '16px 0', background: submitting ? '#C8D8E8' : '#0F2B45',
                                                                                                                 color: '#FFFFFF', border: 'none', borderRadius: 100,
                                                                                                                 fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, fontSize: '1rem',
                                                                                                                 cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                                                                                                     }
                                                                                       }, submitting ? 'Sending...' : 'Submit Feedback')
                                                                                     )
                                                         )
                               );
}
