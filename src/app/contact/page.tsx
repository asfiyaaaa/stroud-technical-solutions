'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus('submitting');
        setFormError('');

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Honeypot check
        if (data.website) return;

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.error || 'Failed to send message');
            }

            setFormStatus('success');
            form.reset();
        } catch (err) {
            setFormStatus('error');
            setFormError(err instanceof Error ? err.message : 'Something went wrong');
        }
    };

    return (
        <>
            {/* Page Header */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900 to-primary-800" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                        <span className="text-accent-light font-semibold text-sm uppercase tracking-wider">Get In Touch</span>
                        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
                            Contact Us
                        </h1>
                        <p className="text-steel-200 text-lg max-w-2xl mx-auto">
                            Ready to discuss your project? Reach out and our team will respond promptly.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInLeft}
                            className="lg:col-span-3"
                        >
                            <h2 className="font-heading text-2xl font-bold text-primary-900 mb-6">Send Us a Message</h2>

                            {formStatus === 'success' ? (
                                <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-200">
                                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="font-heading font-semibold text-xl text-primary-900 mb-2">Message Sent!</h3>
                                    <p className="text-steel-500">Thank you for reaching out. We&apos;ll get back to you within one business day.</p>
                                    <button
                                        onClick={() => setFormStatus('idle')}
                                        className="mt-4 text-accent font-semibold hover:text-accent-dark transition-colors"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
                                    {/* Honeypot */}
                                    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="contact-name" className="block text-sm font-medium text-primary-900 mb-2">Full Name *</label>
                                            <input
                                                id="contact-name"
                                                name="name"
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contact-email" className="block text-sm font-medium text-primary-900 mb-2">Email *</label>
                                            <input
                                                id="contact-email"
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="contact-phone" className="block text-sm font-medium text-primary-900 mb-2">Phone</label>
                                            <input
                                                id="contact-phone"
                                                name="phone"
                                                type="tel"
                                                className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contact-company" className="block text-sm font-medium text-primary-900 mb-2">Company</label>
                                            <input
                                                id="contact-company"
                                                name="company"
                                                type="text"
                                                className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900"
                                                placeholder="Your company name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="contact-message" className="block text-sm font-medium text-primary-900 mb-2">Message *</label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            rows={5}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900 resize-none"
                                            placeholder="Tell us about your project or how we can help..."
                                        />
                                    </div>

                                    {formStatus === 'error' && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                            {formError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        id="submit-contact"
                                    >
                                        {formStatus === 'submitting' ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Contact Info Sidebar */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInRight}
                            className="lg:col-span-2"
                        >
                            <h2 className="font-heading text-2xl font-bold text-primary-900 mb-6">Contact Information</h2>

                            <div className="space-y-6">
                                {/* Phone */}
                                <div className="flex items-start gap-4 p-5 rounded-xl bg-steel-50">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-primary-900 mb-1">Phone</h3>
                                        <a href="tel:919-800-7677" className="text-steel-600 hover:text-accent transition-colors">
                                            919-800-7677
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4 p-5 rounded-xl bg-steel-50">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-primary-900 mb-1">Email</h3>
                                        <a href="mailto:info@stroudtechnicalsolutions.com" className="text-steel-600 hover:text-accent transition-colors break-all">
                                            info@stroudtechnicalsolutions.com
                                        </a>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4 p-5 rounded-xl bg-steel-50">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-primary-900 mb-1">Office</h3>
                                        <p className="text-steel-600">
                                            Stroud Technical Solutions LLC<br />
                                            138 Cotten Drive<br />
                                            Morrisville, NC 27560
                                        </p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-4 p-5 rounded-xl bg-steel-50">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-primary-900 mb-1">Business Hours</h3>
                                        <p className="text-steel-600 text-sm">
                                            Monday – Friday: 8:00 AM – 6:00 PM EST<br />
                                            Weekend: By Appointment
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Google Maps */}
            <section className="bg-steel-100">
                <div className="w-full h-96">
                    <iframe
                        title="Stroud Technical Solutions Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.1234567!2d-78.8!3d35.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ4JzAwLjAiTiA3OMKwNDgnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                    />
                </div>
            </section>
        </>
    );
}
