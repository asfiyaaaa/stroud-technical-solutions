'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements: string;
}

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formError, setFormError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/careers')
            .then((res) => res.json())
            .then((data) => {
                setJobs(data.jobs || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus('submitting');
        setFormError('');

        const form = e.currentTarget;
        const formData = new FormData(form);

        if (selectedJob) {
            formData.append('jobListingId', selectedJob.id);
            formData.append('jobTitle', selectedJob.title);
        }

        try {
            const res = await fetch('/api/careers', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit application');
            }

            setFormStatus('success');
            form.reset();
            if (fileInputRef.current) fileInputRef.current.value = '';
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
                        <span className="text-accent-light font-semibold text-sm uppercase tracking-wider">Join Our Team</span>
                        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
                            Careers at Stroud
                        </h1>
                        <p className="text-steel-200 text-lg max-w-2xl mx-auto">
                            Join a team of engineering professionals dedicated to making a difference in
                            pharmaceutical and life sciences manufacturing.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="section-padding bg-white">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-3xl font-bold text-primary-900">Open Positions</h2>
                        <p className="text-steel-500 mt-3">
                            Explore current opportunities and find the right role for your expertise.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
                            <p className="text-steel-400 mt-4">Loading positions...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-12 bg-steel-50 rounded-2xl">
                            <svg className="w-16 h-16 text-steel-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h3 className="font-heading font-semibold text-xl text-primary-900 mb-2">
                                No Open Positions Right Now
                            </h3>
                            <p className="text-steel-500 max-w-md mx-auto">
                                We don&apos;t currently have any open positions, but we&apos;re always interested in
                                hearing from talented professionals. Submit your resume below or contact us at <a href="mailto:careers@stroudtechnicalsolutions.com" className="text-accent font-semibold">careers@stroudtechnicalsolutions.com</a>.
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-4"
                        >
                            {jobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    variants={staggerItem}
                                    className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${selectedJob?.id === job.id
                                        ? 'border-accent bg-accent/5 shadow-lg'
                                        : 'border-steel-200 hover:border-accent/30 hover:shadow-md'
                                        }`}
                                    onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-heading font-semibold text-lg text-primary-900">{job.title}</h3>
                                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-steel-500">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    {job.department}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {job.location}
                                                </span>
                                                <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full">
                                                    {job.type}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedJob(job);
                                                setShowForm(true);
                                            }}
                                            className="btn-primary text-sm px-6 py-2 shrink-0"
                                        >
                                            Apply Now
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {selectedJob?.id === job.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-4 pt-4 border-t border-steel-100">
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="font-heading font-semibold text-primary-800 mb-2">Description</h4>
                                                            <p className="text-steel-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-heading font-semibold text-primary-800 mb-2">Requirements</h4>
                                                            <p className="text-steel-600 text-sm leading-relaxed whitespace-pre-line">{job.requirements}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Application Form */}
                    <motion.div
                        id="apply"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mt-16"
                    >
                        <div className="bg-steel-50 rounded-2xl p-8 sm:p-10">
                            <h2 className="font-heading text-2xl font-bold text-primary-900 mb-2">
                                {showForm && selectedJob ? `Apply for: ${selectedJob.title}` : 'Submit Your Resume'}
                            </h2>
                            <p className="text-steel-500 mb-8">
                                {showForm && selectedJob
                                    ? 'Complete the form below to apply for this position.'
                                    : 'Interested in working with us? Submit your resume and we\'ll reach out when a suitable position opens.'}
                            </p>

                            {formStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="font-heading font-semibold text-xl text-primary-900 mb-2">Application Submitted!</h3>
                                    <p className="text-steel-500">Thank you for your interest. We&apos;ll review your application and get back to you.</p>
                                    <button
                                        onClick={() => { setFormStatus('idle'); setShowForm(false); setSelectedJob(null); }}
                                        className="mt-4 text-accent font-semibold hover:text-accent-dark transition-colors"
                                    >
                                        Submit Another Application
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Honeypot */}
                                    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="career-name" className="block text-sm font-medium text-primary-900 mb-2">Full Name *</label>
                                            <input
                                                id="career-name"
                                                name="name"
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="career-email" className="block text-sm font-medium text-primary-900 mb-2">Email *</label>
                                            <input
                                                id="career-email"
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="career-phone" className="block text-sm font-medium text-primary-900 mb-2">Phone</label>
                                        <input
                                            id="career-phone"
                                            name="phone"
                                            type="tel"
                                            className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="career-resume" className="block text-sm font-medium text-primary-900 mb-2">Resume *</label>
                                        <input
                                            ref={fileInputRef}
                                            id="career-resume"
                                            name="resume"
                                            type="file"
                                            required
                                            accept=".pdf,.doc,.docx"
                                            className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
                                        />
                                        <p className="text-xs text-steel-400 mt-1">Accepted formats: PDF, DOC, DOCX (max 10MB)</p>
                                    </div>

                                    <div>
                                        <label htmlFor="career-cover" className="block text-sm font-medium text-primary-900 mb-2">Cover Letter</label>
                                        <textarea
                                            id="career-cover"
                                            name="coverLetter"
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary-900 resize-none"
                                            placeholder="Tell us about yourself and why you're interested..."
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
                                        id="submit-application"
                                    >
                                        {formStatus === 'submitting' ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Equal Opportunity Statement */}
            <section className="section-padding bg-steel-50">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                        <h2 className="font-heading text-xl font-semibold text-primary-900 mb-4">
                            Equal Opportunity Employer
                        </h2>
                        <p className="text-steel-500 text-sm leading-relaxed">
                            Stroud Technical Solutions LLC is an equal opportunity employer. We celebrate diversity
                            and are committed to creating an inclusive environment for all employees. All qualified
                            applicants will receive consideration for employment without regard to race, color,
                            religion, gender, gender identity or expression, sexual orientation, national origin,
                            genetics, disability, age, or veteran status.
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
