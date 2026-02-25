import Link from 'next/link';

const footerLinks = {
    services: [
        { label: 'Automation', href: '/services#automation' },
        { label: 'Cleaning Validation', href: '/services#cleaning-validation' },
        { label: 'Quality Engineering', href: '/services#quality-engineering' },
        { label: 'Process Validation', href: '/services#process-validation' },
        { label: 'Metrology & Instrumentation', href: '/services#metrology' },
        { label: 'Manufacturing Engineering', href: '/services#manufacturing' },
    ],
    company: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                                <span className="text-white font-heading font-bold text-lg">S</span>
                            </div>
                            <div>
                                <span className="font-heading font-bold text-lg block">Stroud Technical</span>
                                <span className="text-steel-400 text-xs tracking-wider uppercase">Solutions LLC</span>
                            </div>
                        </div>
                        <p className="text-steel-300 text-sm leading-relaxed mt-4">
                            Delivering compliance, reliability, and operational excellence to the pharmaceutical,
                            life sciences, and biotech industries.
                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-heading font-semibold text-lg mb-4">Services</h3>
                        <ul className="space-y-2">
                            {footerLinks.services.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-steel-300 hover:text-accent-light text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-heading font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-steel-300 hover:text-accent-light text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
                        <div className="space-y-3 text-sm text-steel-300">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-accent mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>138 Cotten Drive<br />Morrisville, NC 27560</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="tel:919-800-7677" className="hover:text-accent-light transition-colors">
                                    919-800-7677
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:info@stroudtechnicalsolutions.com" className="hover:text-accent-light transition-colors">
                                    info@stroudtechnicalsolutions.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-steel-400 text-sm">
                        &copy; {new Date().getFullYear()} Stroud Technical Solutions LLC. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-steel-400">
                        <span>Engineering Excellence</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Regulatory Compliance</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Operational Integrity</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
