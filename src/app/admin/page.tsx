'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

type Tab = 'jobs' | 'contacts' | 'applications';

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements: string;
    isActive: boolean;
    createdAt: string;
}

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    createdAt: string;
    read: boolean;
}

interface Application {
    id: string;
    name: string;
    email: string;
    phone?: string;
    position: string;
    coverLetter?: string;
    resumeUrl: string;
    createdAt: string;
    reviewed: boolean;
}

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('jobs');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [showJobForm, setShowJobForm] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(false);

    const headers = { 'x-admin-password': password, 'Content-Type': 'application/json' };

    const fetchJobs = useCallback(async () => {
        const res = await fetch('/api/admin/jobs', { headers: { 'x-admin-password': password } });
        if (res.ok) {
            const data = await res.json();
            setJobs(data.jobs);
        }
    }, [password]);

    const fetchContacts = useCallback(async () => {
        const res = await fetch('/api/admin/submissions?type=contacts', { headers: { 'x-admin-password': password } });
        if (res.ok) {
            const data = await res.json();
            setContacts(data.submissions);
        }
    }, [password]);

    const fetchApplications = useCallback(async () => {
        const res = await fetch('/api/admin/submissions?type=applications', { headers: { 'x-admin-password': password } });
        if (res.ok) {
            const data = await res.json();
            setApplications(data.submissions);
        }
    }, [password]);

    useEffect(() => {
        if (authenticated) {
            fetchJobs();
            fetchContacts();
            fetchApplications();
        }
    }, [authenticated, fetchJobs, fetchContacts, fetchApplications]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/admin/jobs', { headers: { 'x-admin-password': password } });
        if (res.ok) {
            setAuthenticated(true);
        } else {
            alert('Invalid password');
        }
        setLoading(false);
    };

    const handleJobSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = {
            title: formData.get('title') as string,
            department: formData.get('department') as string,
            location: formData.get('location') as string,
            type: formData.get('type') as string,
            description: formData.get('description') as string,
            requirements: formData.get('requirements') as string,
            isActive: true,
        };

        if (editingJob) {
            await fetch('/api/admin/jobs', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ id: editingJob.id, ...data }),
            });
        } else {
            await fetch('/api/admin/jobs', {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
        }

        setShowJobForm(false);
        setEditingJob(null);
        form.reset();
        fetchJobs();
    };

    const toggleJobActive = async (job: Job) => {
        await fetch('/api/admin/jobs', {
            method: 'PUT',
            headers,
            body: JSON.stringify({ id: job.id, isActive: !job.isActive }),
        });
        fetchJobs();
    };

    const deleteJob = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job listing?')) return;
        await fetch(`/api/admin/jobs?id=${id}`, { method: 'DELETE', headers: { 'x-admin-password': password } });
        fetchJobs();
    };

    const deleteApplication = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application?')) return;
        await fetch(`/api/admin/submissions?id=${id}&type=application`, {
            method: 'DELETE',
            headers: { 'x-admin-password': password },
        });
        fetchApplications();
    };

    const deleteContact = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact submission?')) return;
        await fetch(`/api/admin/submissions?id=${id}&type=contact`, {
            method: 'DELETE',
            headers: { 'x-admin-password': password },
        });
        fetchContacts();
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-steel-50 pt-20">
                <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full max-w-md p-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-primary-900 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="font-heading text-2xl font-bold text-primary-900">Admin Dashboard</h1>
                            <p className="text-steel-500 text-sm mt-2">Stroud Technical Solutions</p>
                        </div>
                        <form onSubmit={handleLogin}>
                            <label htmlFor="admin-password" className="block text-sm font-medium text-primary-900 mb-2">Password</label>
                            <input
                                id="admin-password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-steel-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none mb-4 text-primary-900"
                                placeholder="Enter admin password"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 text-center disabled:opacity-60"
                            >
                                {loading ? 'Authenticating...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-steel-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-primary-900">Admin Dashboard</h1>
                        <p className="text-steel-500 text-sm">Manage job listings, contact submissions, and applications</p>
                    </div>
                    <button
                        onClick={() => { setAuthenticated(false); setPassword(''); }}
                        className="text-steel-500 hover:text-red-600 text-sm font-medium transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-heading font-bold text-primary-800">{jobs.filter(j => j.isActive).length}</div>
                        <div className="text-steel-500 text-sm">Active Jobs</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-heading font-bold text-primary-800">{contacts.length}</div>
                        <div className="text-steel-500 text-sm">Contact Submissions</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-heading font-bold text-primary-800">{applications.length}</div>
                        <div className="text-steel-500 text-sm">Applications</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex border-b border-steel-100">
                        {(['jobs', 'contacts', 'applications'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === tab
                                    ? 'text-accent border-b-2 border-accent bg-accent/5'
                                    : 'text-steel-500 hover:text-primary-900'
                                    }`}
                            >
                                {tab === 'jobs' ? 'Job Listings' : tab === 'contacts' ? 'Contact Submissions' : 'Applications'}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Jobs Tab */}
                        {activeTab === 'jobs' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-heading font-semibold text-lg text-primary-900">Job Listings</h2>
                                    <button
                                        onClick={() => { setShowJobForm(true); setEditingJob(null); }}
                                        className="btn-primary text-sm px-4 py-2"
                                    >
                                        + Add Job
                                    </button>
                                </div>

                                {showJobForm && (
                                    <form onSubmit={handleJobSubmit} className="bg-steel-50 rounded-xl p-6 mb-6 space-y-4">
                                        <h3 className="font-heading font-semibold text-primary-900">
                                            {editingJob ? 'Edit Job' : 'New Job Listing'}
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <input name="title" required placeholder="Job Title" defaultValue={editingJob?.title} className="px-4 py-2.5 rounded-lg border border-steel-200 focus:border-accent outline-none text-sm text-primary-900" />
                                            <input name="department" required placeholder="Department" defaultValue={editingJob?.department} className="px-4 py-2.5 rounded-lg border border-steel-200 focus:border-accent outline-none text-sm text-primary-900" />
                                            <input name="location" required placeholder="Location" defaultValue={editingJob?.location} className="px-4 py-2.5 rounded-lg border border-steel-200 focus:border-accent outline-none text-sm text-primary-900" />
                                            <select name="type" required defaultValue={editingJob?.type || ''} className="px-4 py-2.5 rounded-lg border border-steel-200 focus:border-accent outline-none text-sm text-primary-900">
                                                <option value="" disabled>Select Type</option>
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Contract">Contract</option>
                                            </select>
                                        </div>
                                        <textarea name="description" required placeholder="Job Description" defaultValue={editingJob?.description} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-steel-200 focus:border-accent outline-none text-sm resize-none text-primary-900" />
                                        <textarea name="requirements" required placeholder="Requirements" defaultValue={editingJob?.requirements} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-steel-200 focus:border-accent outline-none text-sm resize-none text-primary-900" />
                                        <div className="flex gap-2">
                                            <button type="submit" className="btn-primary text-sm px-6 py-2">
                                                {editingJob ? 'Update' : 'Create'}
                                            </button>
                                            <button type="button" onClick={() => { setShowJobForm(false); setEditingJob(null); }} className="px-6 py-2 text-sm text-steel-500 hover:text-primary-900 transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {jobs.length === 0 ? (
                                    <p className="text-steel-400 text-center py-8">No job listings yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {jobs.map((job) => (
                                            <div key={job.id} className="flex items-center justify-between p-4 rounded-xl border border-steel-100 hover:bg-steel-50 transition-colors">
                                                <div>
                                                    <h3 className="font-semibold text-primary-900">{job.title}</h3>
                                                    <div className="flex gap-3 text-xs text-steel-500 mt-1">
                                                        <span>{job.department}</span>
                                                        <span>•</span>
                                                        <span>{job.location}</span>
                                                        <span>•</span>
                                                        <span>{job.type}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleJobActive(job)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-steel-100 text-steel-500'
                                                            }`}
                                                    >
                                                        {job.isActive ? 'Active' : 'Inactive'}
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingJob(job); setShowJobForm(true); }}
                                                        className="p-1.5 text-steel-400 hover:text-accent transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteJob(job.id)}
                                                        className="p-1.5 text-steel-400 hover:text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contacts Tab */}
                        {activeTab === 'contacts' && (
                            <div>
                                <h2 className="font-heading font-semibold text-lg text-primary-900 mb-6">Contact Submissions</h2>
                                {contacts.length === 0 ? (
                                    <p className="text-steel-400 text-center py-8">No contact submissions yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {contacts.map((sub) => (
                                            <div key={sub.id} className="p-4 rounded-xl border border-steel-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-primary-900">{sub.name}</h3>
                                                        <div className="flex gap-3 text-xs text-steel-500">
                                                            <span>{sub.email}</span>
                                                            {sub.phone && <><span>•</span><span>{sub.phone}</span></>}
                                                            {sub.company && <><span>•</span><span>{sub.company}</span></>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-steel-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                                        <button
                                                            onClick={() => deleteContact(sub.id)}
                                                            className="p-1 text-steel-400 hover:text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-steel-600 text-sm leading-relaxed mt-2 bg-steel-50 p-3 rounded-lg">{sub.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Applications Tab */}
                        {activeTab === 'applications' && (
                            <div>
                                <h2 className="font-heading font-semibold text-lg text-primary-900 mb-6">Job Applications</h2>
                                {applications.length === 0 ? (
                                    <p className="text-steel-400 text-center py-8">No applications yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {applications.map((app) => (
                                            <div key={app.id} className="p-4 rounded-xl border border-steel-100">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-primary-900">{app.name}</h3>
                                                        <div className="flex gap-3 text-xs text-steel-500 mt-1">
                                                            <span>{app.email}</span>
                                                            {app.phone && <><span>•</span><span>{app.phone}</span></>}
                                                        </div>
                                                        <div className="mt-1">
                                                            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                                {app.position}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-steel-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                                                        <button
                                                            onClick={() => deleteApplication(app.id)}
                                                            className="p-1 text-steel-400 hover:text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                {app.coverLetter && (
                                                    <p className="text-steel-600 text-sm leading-relaxed mt-3 bg-steel-50 p-3 rounded-lg">{app.coverLetter}</p>
                                                )}
                                                <div className="mt-3">
                                                    <a
                                                        href={app.resumeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Download Resume
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
